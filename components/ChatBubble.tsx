interface Props {
  role: 'user' | 'assistant';
  children: React.ReactNode;
}

/** 对话气泡：AI 在左（灰底），用户回答在右（黑底） */
export default function ChatBubble({ role, children }: Props) {
  return (
    <div className={`chat-bubble ${role === 'user' ? 'chat-user' : 'chat-ai'}`}>
      {role === 'assistant' && <span className="chat-emoji">🍉</span>}
      <div className="chat-text">{children}</div>
    </div>
  );
}
