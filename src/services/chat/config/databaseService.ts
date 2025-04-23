import { auth } from '@/auth';

interface ChatDatabases {
  Chat_Global_DB: Map<string, string>;
  Chat_Bot_DB: string[];
  Routing_Chat_Bot_DB: string[];
  Working_Hours_DB: Map<string, string>;
}

class ChatDatabaseService {
  private static instance: ChatDatabaseService;
  private databases: ChatDatabases;
  private lastUpdate: Date;

  private constructor() {
    this.databases = {
      Chat_Global_DB: new Map(),
      Chat_Bot_DB: [],
      Routing_Chat_Bot_DB: [],
      Working_Hours_DB: new Map(),
    };
    this.lastUpdate = new Date(0); // Force first update
  }

  public static getInstance(): ChatDatabaseService {
    if (!ChatDatabaseService.instance) {
      ChatDatabaseService.instance = new ChatDatabaseService();
    }
    return ChatDatabaseService.instance;
  }

  async updateDatabases(): Promise<void> {
    const now = new Date();
    // Only update if more than an hour has passed
    if (now.getTime() - this.lastUpdate.getTime() < 3600000) {
      return;
    }

    try {
      const session = await auth();
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      // Fetch fresh data from your backend
      const responses = await Promise.all([
        fetch('/api/chat/databases/global'),
        fetch('/api/chat/databases/bot'),
        fetch('/api/chat/databases/routing'),
        fetch('/api/chat/databases/hours'),
      ]);

      const [globalDB, botDB, routingDB, hoursDB] = await Promise.all(
        responses.map((r) => r.json()),
      );

      // Update the databases
      this.databases.Chat_Global_DB = new Map(Object.entries(globalDB));
      this.databases.Chat_Bot_DB = botDB;
      this.databases.Routing_Chat_Bot_DB = routingDB;
      this.databases.Working_Hours_DB = new Map(Object.entries(hoursDB));

      this.lastUpdate = now;
    } catch (error) {
      console.error('Failed to update chat databases:', error);
      throw error;
    }
  }

  async isUserInGlobalDB(userId: string): Promise<boolean> {
    await this.updateDatabases();
    return this.databases.Chat_Global_DB.has(userId);
  }

  async isUserInGroup127600(userId: string): Promise<boolean> {
    await this.updateDatabases();
    return this.databases.Chat_Global_DB.get(userId) === '127600';
  }

  async getBotName(userId: string): Promise<string | null> {
    await this.updateDatabases();
    return (
      this.databases.Chat_Bot_DB.find((bot) => bot.startsWith(userId)) || null
    );
  }

  async getRoutingInfo(userId: string): Promise<string | null> {
    await this.updateDatabases();
    return (
      this.databases.Routing_Chat_Bot_DB.find((route) =>
        route.startsWith(userId),
      ) || null
    );
  }

  async isWithinWorkingHours(): Promise<boolean> {
    await this.updateDatabases();
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const hours = this.databases.Working_Hours_DB.get(`${currentDay}`);
    if (!hours) return false;

    const [start, end] = hours.split('-').map(Number);
    return currentHour >= start && currentHour < end;
  }
}

export const chatDatabaseService = ChatDatabaseService.getInstance();
