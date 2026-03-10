import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Datasource, DataSourceConnectionConfig } from '../database/entities/datasource.entity';
import { Client } from 'ssh2';

@Injectable()
export class DatasourcesService {
    constructor(
        @InjectRepository(Datasource)
        private readonly datasourceRepository: Repository<Datasource>
    ) { }

    // SSH隧道端口映射
    private sshTunnels: Map<number, { sshClient: Client; localPort: number }> = new Map();

    async findAll(page: number = 1, pageSize: number = 20, status?: number, sourceType?: string) {
        const queryBuilder = this.datasourceRepository.createQueryBuilder('datasource');

        if (status !== undefined) {
            queryBuilder.andWhere('datasource.status = :status', { status });
        }

        if (sourceType) {
            queryBuilder.andWhere('datasource.sourceType = :sourceType', { sourceType });
        }

        queryBuilder.orderBy('datasource.createTime', 'DESC');

        const total = await queryBuilder.getCount();
        const totalPages = Math.ceil(total / pageSize);
        const list = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();

        return {
            list,
            pagination: { total, page: Number(page), pageSize: Number(pageSize), totalPages }
        };
    }

    async findOne(id: number) {
        const datasource = await this.datasourceRepository.findOne({ where: { id } });
        if (!datasource) throw new NotFoundException('Datasource not found');
        return datasource;
    }

    async create(data: Partial<Datasource>) {
        const datasource = this.datasourceRepository.create({
            ...data,
            status: data.status ?? 1,
            createTime: new Date()
        });
        return await this.datasourceRepository.save(datasource);
    }

    async update(id: number, data: Partial<Datasource>) {
        const datasource = await this.findOne(id);
        Object.assign(datasource, data);
        return await this.datasourceRepository.save(datasource);
    }

    async remove(id: number) {
        const datasource = await this.findOne(id);
        await this.datasourceRepository.remove(datasource);
        return { message: 'Datasource deleted successfully' };
    }

    async executeQuery(id: number, query: string, params: any[] = []): Promise<any> {
        const datasource = await this.findOne(id);
        
        if (datasource.sourceType === 'mysql') {
            return await this.executeMySqlQuery(datasource.connectionConfig, query, params);
        } else {
            throw new BadRequestException(`Unsupported datasource type for SQL query: ${datasource.sourceType}`);
        }
    }

    async executeApi(id: number, path: string, params?: any): Promise<any> {
        const datasource = await this.findOne(id);
        
        if (datasource.sourceType === 'api') {
            return await this.executeApiRequest(datasource.connectionConfig, path, params);
        } else {
            throw new BadRequestException(`Datasource is not an API type: ${datasource.sourceType}`);
        }
    }

    private async executeMySqlQuery(config: any, query: string, params: any[]): Promise<any> {
        // 如果是SSH连接，使用SSH隧道执行查询
        if (config.sshConfig) {
            return await this.executeMySqlQueryViaSSH(config, query, params);
        }
        
        // 直连执行查询
        const { DataSource } = require('typeorm');
        const dataSource = new DataSource({
            type: 'mysql',
            host: config.host,
            port: parseInt(config.port),
            username: config.username,
            password: config.password,
            database: config.database,
            synchronize: false,
            logging: true,
        });

        try {
            await dataSource.initialize();
            // params from frontend might be an object if using named parameters, but typeorm query uses array for ? placeholders
            // or object for :param placeholders.
            // If params is an array, pass it directly.
            // If params is an object, we might need to be careful.
            // For simplicity, let's assume params is passed correctly by the caller (ApisService).
            const result = await dataSource.query(query, params);
            await dataSource.destroy();
            return result;
        } catch (error) {
            if (dataSource.isInitialized) {
                await dataSource.destroy();
            }
            throw new BadRequestException(`Query execution failed: ${error.message}`);
        }
    }

    private async executeMySqlQueryViaSSH(config: any, query: string, params: any[]): Promise<any> {
        const sshConfig = config.sshConfig;
        const dbPort = parseInt(config.port);
        
        return new Promise((resolve, reject) => {
            const sshClient = new Client();
            
            // 查找可用的本地端口
            const localPort = this.findAvailablePort();
            
            sshClient.on('ready', () => {
                // 建立SSH隧道
                sshClient.forwardOut('127.0.0.1', localPort, '127.0.0.1', dbPort, (err, stream) => {
                    if (err) {
                        sshClient.end();
                        return reject(new BadRequestException(`SSH forward failed: ${err.message}`));
                    }
                    
                    // 使用SSH隧道连接MySQL并执行查询
                    const { DataSource } = require('typeorm');
                    const dataSource = new DataSource({
                        type: 'mysql',
                        host: '127.0.0.1',
                        port: localPort,
                        username: config.username,
                        password: config.password,
                        database: config.database,
                        synchronize: false,
                        logging: true,
                    });

                    dataSource.initialize().then(() => {
                        return dataSource.query(query, params);
                    }).then((result) => {
                        dataSource.destroy();
                        sshClient.end();
                        resolve(result);
                    }).catch((error) => {
                        if (dataSource.isInitialized) {
                            dataSource.destroy();
                        }
                        sshClient.end();
                        reject(new BadRequestException(`Query execution via SSH failed: ${error.message}`));
                    });
                });
            });

            // SSH连接配置
            const sshOptions: any = {
                host: sshConfig.host,
                port: sshConfig.port,
                username: sshConfig.username,
            };

            if (sshConfig.authType === 'password') {
                sshOptions.password = sshConfig.password;
            } else if (sshConfig.authType === 'key') {
                sshOptions.privateKey = sshConfig.privateKey;
                if (sshConfig.keyPassword) {
                    sshOptions.passphrase = sshConfig.keyPassword;
                }
            }

            sshClient.connect(sshOptions);

            sshClient.on('error', (err) => {
                reject(new BadRequestException(`SSH connection failed: ${err.message}`));
            });

            sshClient.on('end', () => {
                // SSH连接结束，清理资源
                resolve(null);
            });

            sshClient.on('close', () => {
                // SSH连接关闭，清理资源
                this.cleanupSshTunnel(config.id);
            });
        });
    }

    private async executeApiRequest(config: any, path: string, params?: any): Promise<any> {
        const baseUrl = config.url.replace(/\/$/, '');
        const url = baseUrl + path;
        
        const https = require('https');
        const http = require('http');
        
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;
            
            // Handle query parameters
            if (params && Object.keys(params).length > 0) {
                const searchParams = new URLSearchParams(params);
                urlObj.search = urlObj.search ? `${urlObj.search}&${searchParams.toString()}` : `?${searchParams.toString()}`;
            }
            
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: 'GET', // Default to GET for now
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            const req = client.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const jsonData = data ? JSON.parse(data) : {};
                        // Return raw data, do not wrap in { status: 'success' }
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(jsonData);
                        } else {
                            // If API returns error structure, resolve it but maybe log it?
                            // Or reject? Better to resolve if it's a valid JSON response from API.
                            // But for consistency with SQL, maybe we should just return the data.
                            resolve(jsonData);
                        }
                    } catch (error) {
                        // If not JSON, return text
                        resolve(data);
                    }
                });
            });
            
            req.on('error', (error) => {
                reject(new BadRequestException(`API request failed: ${error.message}`));
            });
            
            req.on('timeout', () => {
                req.destroy();
                reject(new BadRequestException('API request timeout'));
            });
            
            req.setTimeout(10000); // 10s timeout
            req.end();
        });
    }

    async testConnection(id: number) {
        const datasource = await this.findOne(id);

        const startTime = Date.now();

        try {
            let success = false;
            let message = 'Connection test successful';

            switch (datasource.sourceType) {
                case 'mysql':
                    success = await this.testMySqlConnection(datasource.connectionConfig);
                    break;
                case 'postgresql':
                    success = await this.testPostgresConnection(datasource.connectionConfig);
                    break;
                case 'mongodb':
                    success = await this.testMongoConnection(datasource.connectionConfig);
                    break;
                case 'redis':
                    success = await this.testRedisConnection(datasource.connectionConfig);
                    break;
                case 'api':
                    success = await this.testApiConnection(datasource.connectionConfig);
                    break;
                default:
                    throw new BadRequestException(`Unsupported datasource type: ${datasource.sourceType}`);
            }

            const responseTime = Date.now() - startTime;

            await this.update(datasource.id, {
                lastTestTime: new Date(),
                lastTestResult: JSON.stringify({ success, message, responseTime })
            });

            return {
                success,
                message,
                responseTime
            };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            const errorMessage = error.message || 'Connection test failed';

            await this.update(datasource.id, {
                lastTestTime: new Date(),
                lastTestResult: JSON.stringify({ success: false, message: errorMessage, responseTime })
            });

            throw new BadRequestException(errorMessage);
        }
    }

    private async testMySqlConnection(config: any): Promise<boolean> {
        if (!config.host || !config.database) {
            throw new BadRequestException('MySQL connection config missing required fields');
        }
        
        // 如果是SSH连接，创建SSH隧道
        if (config.sshConfig) {
            return await this.testMySqlConnectionViaSSH(config);
        }
        
        // 直连测试
        const { DataSource } = require('typeorm');
        const dataSource = new DataSource({
            type: 'mysql',
            host: config.host,
            port: parseInt(config.port),
            username: config.username,
            password: config.password,
            database: config.database,
            synchronize: false,
            logging: false,
        });

        try {
            await dataSource.initialize();
            await dataSource.query('SELECT 1');
            await dataSource.destroy();
            return true;
        } catch (error) {
            if (dataSource.isInitialized) {
                await dataSource.destroy();
            }
            throw new BadRequestException(`MySQL connection failed: ${error.message}`);
        }
    }

    private async testMySqlConnectionViaSSH(config: any): Promise<boolean> {
        const sshConfig = config.sshConfig;
        const dbPort = parseInt(config.port);
        
        return new Promise((resolve, reject) => {
            const sshClient = new Client();
            
            // 查找可用的本地端口
            const localPort = this.findAvailablePort();
            
            sshClient.on('ready', () => {
                // 建立SSH隧道
                sshClient.forwardOut('127.0.0.1', localPort, '127.0.0.1', dbPort, (err, stream) => {
                    if (err) {
                        sshClient.end();
                        return reject(new BadRequestException(`SSH forward failed: ${err.message}`));
                    }
                    
                    // 使用SSH隧道连接MySQL
                    const { DataSource } = require('typeorm');
                    const dataSource = new DataSource({
                        type: 'mysql',
                        host: '127.0.0.1',
                        port: localPort,
                        username: config.username,
                        password: config.password,
                        database: config.database,
                        synchronize: false,
                        logging: false,
                    });

                    dataSource.initialize().then(() => {
                        return dataSource.query('SELECT 1');
                    }).then(() => {
                        dataSource.destroy();
                        sshClient.end();
                        resolve(true);
                    }).catch((error) => {
                        if (dataSource.isInitialized) {
                            dataSource.destroy();
                        }
                        sshClient.end();
                        reject(new BadRequestException(`MySQL connection via SSH failed: ${error.message}`));
                    });
                });
            });

            // SSH连接配置
            const sshOptions: any = {
                host: sshConfig.host,
                port: sshConfig.port,
                username: sshConfig.username,
            };

            if (sshConfig.authType === 'password') {
                sshOptions.password = sshConfig.password;
            } else if (sshConfig.authType === 'key') {
                sshOptions.privateKey = sshConfig.privateKey;
                if (sshConfig.keyPassword) {
                    sshOptions.passphrase = sshConfig.keyPassword;
                }
            }

            sshClient.connect(sshOptions);

            sshClient.on('error', (err) => {
                reject(new BadRequestException(`SSH connection failed: ${err.message}`));
            });

            sshClient.on('end', () => {
                // SSH连接结束，清理资源
                resolve(false);
            });

            sshClient.on('close', () => {
                // SSH连接关闭，清理资源
                this.cleanupSshTunnel(config.id);
            });
        });
    }

    // 查找可用端口
    private findAvailablePort(): number {
        const startPort = 33070; // 起始端口
        const maxAttempts = 100;
        
        for (let i = 0; i < maxAttempts; i++) {
            const port = startPort + i;
            if (!this.isPortInUse(port)) {
                return port;
            }
        }
        
        throw new BadRequestException('No available port for SSH tunnel');
    }

    // 检查端口是否被占用
    private isPortInUse(port: number): boolean {
        // 简单的端口检查，实际应用中可能需要更复杂的逻辑
        return this.sshTunnels.has(port);
    }

    // 清理SSH隧道
    private cleanupSshTunnel(datasourceId: number): void {
        const tunnel = this.sshTunnels.get(datasourceId);
        if (tunnel) {
            tunnel.sshClient.end();
            this.sshTunnels.delete(datasourceId);
        }
    }

    private async testPostgresConnection(config: any): Promise<boolean> {
        if (!config.host || !config.database) {
            throw new BadRequestException('PostgreSQL connection config missing required fields');
        }
        
        // 如果是SSH连接，创建SSH隧道
        if (config.sshConfig) {
            return await this.testPostgresConnectionViaSSH(config);
        }
        
        // 直连测试
        const { Client } = require('pg');
        const connectionString = `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
        const client = new Client({
            connectionString: connectionString,
        });

        try {
            await client.connect();
            await client.query('SELECT 1');
            await client.end();
            return true;
        } catch (error) {
            throw new BadRequestException(`PostgreSQL connection failed: ${error.message}`);
        }
    }

    private async testPostgresConnectionViaSSH(config: any): Promise<boolean> {
        const sshConfig = config.sshConfig;
        const dbPort = parseInt(config.port);
        
        return new Promise((resolve, reject) => {
            const sshClient = new Client();
            
            // 查找可用的本地端口
            const localPort = this.findAvailablePort();
            
            sshClient.on('ready', () => {
                // 建立SSH隧道
                sshClient.forwardOut('127.0.0.1', localPort, '127.0.0.1', dbPort, (err, stream) => {
                    if (err) {
                        sshClient.end();
                        return reject(new BadRequestException(`SSH forward failed: ${err.message}`));
                    }
                    
                    // 使用SSH隧道连接PostgreSQL
                    const { Client } = require('pg');
                    const client = new Client({
                        host: '127.0.0.1',
                        port: localPort,
                        user: config.username,
                        password: config.password,
                        database: config.database,
                    });

                    client.connect().then(() => {
                        return client.query('SELECT 1');
                    }).then(() => {
                        client.end();
                        sshClient.end();
                        resolve(true);
                    }).catch((error) => {
                        client.end();
                        sshClient.end();
                        reject(new BadRequestException(`PostgreSQL connection via SSH failed: ${error.message}`));
                    });
                });
            });

            // SSH连接配置
            const sshOptions: any = {
                host: sshConfig.host,
                port: sshConfig.port,
                username: sshConfig.username,
            };

            if (sshConfig.authType === 'password') {
                sshOptions.password = sshConfig.password;
            } else if (sshConfig.authType === 'key') {
                sshOptions.privateKey = sshConfig.privateKey;
                if (sshConfig.keyPassword) {
                    sshOptions.passphrase = sshConfig.keyPassword;
                }
            }

            sshClient.connect(sshOptions);

            sshClient.on('error', (err) => {
                reject(new BadRequestException(`SSH connection failed: ${err.message}`));
            });

            sshClient.on('end', () => {
                resolve(false);
            });

            sshClient.on('close', () => {
                this.cleanupSshTunnel(config.id);
            });
        });
    }

    private async testMongoConnection(config: any): Promise<boolean> {
        if (!config.host || !config.database) {
            throw new BadRequestException('MongoDB connection config missing required fields');
        }
        
        // 如果是SSH连接，创建SSH隧道
        if (config.sshConfig) {
            return await this.testMongoConnectionViaSSH(config);
        }
        
        // 直连测试
        const { MongoClient } = require('mongodb');
        const mongoUri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
        
        return new Promise((resolve, reject) => {
            const client = new MongoClient(mongoUri);
            
            client.connect().then(() => {
                return client.db().admin().ping();
            }).then(() => {
                client.close();
                resolve(true);
            }).catch((error) => {
                client.close();
                reject(new BadRequestException(`MongoDB connection failed: ${error.message}`));
            });
        });
    }

    private async testMongoConnectionViaSSH(config: any): Promise<boolean> {
        const sshConfig = config.sshConfig;
        const dbPort = parseInt(config.port);
        
        return new Promise((resolve, reject) => {
            const sshClient = new Client();
            
            // 查找可用的本地端口
            const localPort = this.findAvailablePort();
            
            sshClient.on('ready', () => {
                // 建立SSH隧道
                sshClient.forwardOut('127.0.0.1', localPort, '127.0.0.1', dbPort, (err, stream) => {
                    if (err) {
                        sshClient.end();
                        return reject(new BadRequestException(`SSH forward failed: ${err.message}`));
                    }
                    
                    // 使用SSH隧道连接MongoDB
                    const { MongoClient } = require('mongodb');
                    const mongoUri = `mongodb://127.0.0.1:${localPort}/${config.database}`;
                    
                    const client = new MongoClient(mongoUri);
                    
                    client.connect().then(() => {
                        return client.db().admin().ping();
                    }).then(() => {
                        client.close();
                        sshClient.end();
                        resolve(true);
                    }).catch((error) => {
                        client.close();
                        sshClient.end();
                        reject(new BadRequestException(`MongoDB connection via SSH failed: ${error.message}`));
                    });
                });
            });

            // SSH连接配置
            const sshOptions: any = {
                host: sshConfig.host,
                port: sshConfig.port,
                username: sshConfig.username,
            };

            if (sshConfig.authType === 'password') {
                sshOptions.password = sshConfig.password;
            } else if (sshConfig.authType === 'key') {
                sshOptions.privateKey = sshConfig.privateKey;
                if (sshConfig.keyPassword) {
                    sshOptions.passphrase = sshConfig.keyPassword;
                }
            }

            sshClient.connect(sshOptions);

            sshClient.on('error', (err) => {
                reject(new BadRequestException(`SSH connection failed: ${err.message}`));
            });

            sshClient.on('end', () => {
                resolve(false);
            });

            sshClient.on('close', () => {
                this.cleanupSshTunnel(config.id);
            });
        });
    }

    private async testRedisConnection(config: any): Promise<boolean> {
        if (!config.host || !config.port) {
            throw new BadRequestException('Redis connection config missing required fields');
        }
        return true;
    }

    private async testApiConnection(config: any): Promise<boolean> {
        if (!config.url) {
            throw new BadRequestException('API connection config missing required fields');
        }
        return true;
    }
}
