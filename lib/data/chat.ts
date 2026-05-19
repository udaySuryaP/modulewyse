"use client";

import type {
  Conversation,
  Message,
  MessageFeedback,
  MessageFeedbackRating,
  MessageRole,
} from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export type CreateConversationInput = {
  userId: string;
  title: string;
  subjectSlug?: string | null;
  moduleValue?: string | null;
};

export type InsertMessageInput = {
  answerType?: string | null;
  content: string;
  conversationId: string;
  metadata?: Record<string, unknown>;
  role: MessageRole;
  userId: string;
};

export type SaveMessageFeedbackInput = {
  messageId: string;
  note?: string | null;
  rating: MessageFeedbackRating;
  userId: string;
};

export type ConversationWithMessages = {
  conversation: Conversation;
  feedback: MessageFeedback[];
  messages: Message[];
};

export async function createConversation(input: CreateConversationInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      module_value: input.moduleValue ?? null,
      subject_slug: input.subjectSlug ?? null,
      title: input.title,
      user_id: input.userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Conversation;
}

export async function getUserConversations() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return (data ?? []) as Conversation[];
}

export async function getConversationWithMessages(
  conversationId: string,
): Promise<ConversationWithMessages | null> {
  const supabase = createClient();
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .maybeSingle();

  if (conversationError) {
    throw conversationError;
  }

  if (!conversation) {
    return null;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw messagesError;
  }

  const messageIds = (messages ?? []).map((message) => message.id);
  const { data: feedback, error: feedbackError } = messageIds.length
    ? await supabase
        .from("message_feedback")
        .select("*")
        .in("message_id", messageIds)
    : { data: [], error: null };

  if (feedbackError) {
    throw feedbackError;
  }

  return {
    conversation: conversation as Conversation,
    feedback: (feedback ?? []) as MessageFeedback[],
    messages: (messages ?? []) as Message[],
  };
}

export async function insertMessage(input: InsertMessageInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      answer_type: input.answerType ?? null,
      content: input.content,
      conversation_id: input.conversationId,
      metadata: input.metadata ?? {},
      role: input.role,
      user_id: input.userId,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Message;
}

export async function updateConversationTitle(
  conversationId: string,
  title: string,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Conversation;
}

export async function saveMessageFeedback(input: SaveMessageFeedbackInput) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("message_feedback")
    .upsert(
      {
        message_id: input.messageId,
        note: input.note ?? null,
        rating: input.rating,
        user_id: input.userId,
      },
      { onConflict: "message_id,user_id" },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as MessageFeedback;
}

export async function deleteConversation(conversationId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (error) {
    throw error;
  }
}
