import React from 'react';

const ComposeAssistant: React.FC = () => {
  const [prompt, setPrompt] = React.useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  
  const handleGenerateEmail = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Get user context and other necessary data
      const { userContext } = await chrome.storage.sync.get(['userContext']);
      
      // Here you would:
      // 1. Get recipient email and look up their context
      // 2. Send prompt + contexts to LLM API
      // 3. Insert response into the Gmail compose box
      
      // This is a placeholder for the actual implementation
      setTimeout(() => {
        const composeBox = document.querySelector('.Am.Al.editable');
        if (composeBox) {
          composeBox.innerHTML = `<p>Dear Recipient,</p><p>This is a placeholder for the generated email based on your prompt: "${prompt}"</p><p>Best regards,<br>${userContext?.name || 'Your Name'}</p>`;
        }
        setIsGenerating(false);
        setPrompt('');
      }, 1500);
    } catch (error) {
      console.error('Failed to generate email:', error);
      setIsGenerating(false);
    }
  };
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What would you like to write about?"
        style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid #ccc',
          fontSize: '14px'
        }}
        disabled={isGenerating}
      />
      <button
        onClick={handleGenerateEmail}
        disabled={isGenerating || !prompt.trim()}
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: '#1a73e8',
          color: 'white',
          border: 'none',
          fontWeight: 'bold',
          cursor: isGenerating || !prompt.trim() ? 'default' : 'pointer',
          opacity: isGenerating || !prompt.trim() ? 0.7 : 1
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
};

export default ComposeAssistant;