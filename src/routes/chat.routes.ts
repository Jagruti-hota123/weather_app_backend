
import { conversationService } from "../services/Conversation.service.js";
import { chatWithGrok } from "../services/grok.service.js";
import { FastifyInstance } from "fastify";


export default async function chatRoutes(fastify: FastifyInstance) {
  
  // 1. Create new conversation
  fastify.post('/conversation', async (request, reply) => {
    console.log(request)
    try {
      const conversation = await conversationService.createConversation();
      
      return reply.send({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      console.error('Create conversation error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to create conversation'
      });
    }
  });

  // 2. Get all conversations
  fastify.get('/conversations', async (request, reply) => {
    console.log(request)
    try {
      const conversations = await conversationService.getAllConversations();
      
      return reply.send({
        success: true,
        data: conversations
      });
    } catch (error: any) {
      console.error('Get conversations error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch conversations'
      });
    }
  });

  // 3. Get specific conversation
  fastify.get('/conversation/:conversationId', async (request, reply) => {
    const { conversationId } = request.params as { conversationId: string };
    
    try {
      const conversation = await conversationService.getConversation(conversationId);
      
      return reply.send({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      console.error('Get conversation error:', error);
      return reply.code(404).send({
        success: false,
        error: 'Conversation not found'
      });
    }
  });

  // 4. Send message (UPDATED - now requires conversationId)
  fastify.post('/message', async (request, reply) => {
    const { message, conversationId } = request.body as { 
      message: string; 
      conversationId: string;
    };
    
    if (!message || message.trim() === '') {
      return reply.code(400).send({ error: 'Message is required' });
    }

    if (!conversationId) {
      return reply.code(400).send({ error: 'conversationId is required' });
    }
    
    try {
      const result = await chatWithGrok(message, conversationId);
      
      return reply.send({
        success: true,
        response: result.message,
        toolUsed: result.toolUsed,
        data: result.weatherData
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to process message'
      });
    }
  });

  // 5. Delete conversation
  fastify.delete('/conversation/:conversationId', async (request, reply) => {
    const { conversationId } = request.params as { conversationId: string };
    
    try {
      await conversationService.deleteConversation(conversationId);
      
      return reply.send({
        success: true,
        message: 'Conversation deleted'
      });
    } catch (error: any) {
      console.error('Delete conversation error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to delete conversation'
      });
    }
  });

  // 6. Update conversation title
  fastify.patch('/conversation/:conversationId/title', async (request, reply) => {
    const { conversationId } = request.params as { conversationId: string };
    const { title } = request.body as { title: string };
    
    if (!title || title.trim() === '') {
      return reply.code(400).send({ error: 'Title is required' });
    }

    try {
      const conversation = await conversationService.updateTitle(conversationId, title);
      
      return reply.send({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      console.error('Update title error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to update title'
      });
    }
  });
}