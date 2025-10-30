import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolUsed?: string | null;
  weatherData?: any;
  timestamp: Date;
}

export interface IConversation extends Document {
  conversationId: string;
  userId?: string; // Optional - for future authentication
  title: string; // Auto-generated from first message
  messages: IMessage[];
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  toolUsed: {
    type: String,
    default: null,
  },
  weatherData: {
    type: Schema.Types.Mixed,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new Schema<IConversation>(
  {
    conversationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      maxlength: 100,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for faster queries
ConversationSchema.index({ conversationId: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);