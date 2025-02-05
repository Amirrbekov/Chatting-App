import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly redis: Redis;
    private readonly USER_STATUS_PREFIX = 'user_status:';
    private readonly USER_SOCKET_PREFIX = 'user_socket:';

    constructor() {
        this.redis = new Redis();
    }

    async set(key: string, value: string, expireSeconds?: number): Promise<void> {
        try {
          if (expireSeconds) {
            await this.redis.set(key, value, 'EX', expireSeconds);
          } else {
            await this.redis.set(key, value);
          }
        } catch (error) {
          throw new Error(`Failed to set key in Redis: ${error.message}`);
        }
    }

    async get(key: string): Promise<string | null> {
        try {
          return await this.redis.get(key);
        } catch (error) {
          throw new Error(`Failed to get key from Redis: ${error.message}`);
        }
    }

    async del(key: string): Promise<number> {
        try {
          return await this.redis.del(key);
        } catch (error) {
          throw new Error(`Failed to delete key from Redis: ${error.message}`);
        }
    }

    async exists(key: string): Promise<number> {
        try {
          return await this.redis.exists(key);
        } catch (error) {
          throw new Error(`Failed to check key existence in Redis: ${error.message}`);
        }
    }



    async setUserOnline(userId: string, socketId: string): Promise<void> {
      await this.set(`${this.USER_STATUS_PREFIX}${userId}`, 'online');
      await this.set(`${this.USER_SOCKET_PREFIX}${userId}`, socketId);
    }

    async setUserOffline(userId: string): Promise<void> {
      await this.set(`${this.USER_STATUS_PREFIX}${userId}`, 'offline');
      await this.del(`${this.USER_SOCKET_PREFIX}${userId}`);
    }

    async getUserStatus(userId: string): Promise<string> {
      const status = await this.get(`${this.USER_STATUS_PREFIX}${userId}`);
      return status || 'offline';
    }

    async getAllOnlineUsers(): Promise<string[]> {
      const keys = await this.redis.keys(`${this.USER_STATUS_PREFIX}*`);
      const onlineUsers: string[] = [];
      
      for (const key of keys) {
          const status = await this.get(key);
          if (status === 'online') {
              const userId = key.replace(this.USER_STATUS_PREFIX, '')
              onlineUsers.push(userId);
          }
      }
      
      return onlineUsers;
    }
}
