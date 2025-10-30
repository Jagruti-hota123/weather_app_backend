import { Conversation, IMessage } from '@/models/Conversation.model.js';
import { v4 as uuidv4 } from 'uuid';

export const conversationService = {
  /**
   * Create a new conversation
   */
  async createConversation(userId?: string) {
    const conversationId = uuidv4();
    
    const conversation = new Conversation({
      conversationId,
      userId,
      title: 'New Conversation',
      messages: [],
      lastMessageAt: new Date(),
    });

    await conversation.save();
    return conversation;
  },

  /**
   * Get all conversations (sorted by most recent)
   */
  async getAllConversations(userId?: string, limit: number = 20) {
    const query = userId ? { userId } : {};
    
    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return conversations;
  },

  /**
   * Get a specific conversation by ID
   */
  async getConversation(conversationId: string) {
    const conversation = await Conversation.findOne({ conversationId })
      .lean()
      .exec();

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  },

  /**
   * Add a message to conversation
   */
  async addMessage(
    conversationId: string,
    message: IMessage
  ) {
    const conversation = await Conversation.findOne({ conversationId });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.messages.push(message);
    conversation.lastMessageAt = new Date();

    // Auto-generate title from first user message
    if (conversation.messages.length === 1 && message.role === 'user') {
      conversation.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
    }

    await conversation.save();
    return conversation;
  },

  /**
   * Update conversation title
   */
  async updateTitle(conversationId: string, title: string) {
    const conversation = await Conversation.findOneAndUpdate(
      { conversationId },
      { title },
      { new: true }
    );

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string) {
    const result = await Conversation.deleteOne({ conversationId });

    if (result.deletedCount === 0) {
      throw new Error('Conversation not found');
    }

    return { success: true };
  },

  /**
   * Clear all messages from a conversation
   */
  async clearMessages(conversationId: string) {
    const conversation = await Conversation.findOneAndUpdate(
      { conversationId },
      { messages: [], lastMessageAt: new Date() },
      { new: true }
    );

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  },
};