import * as React from 'react';

interface EmailTemplateProps {
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message,
}) => {
  // Break the message into lines to format it properly
  const messageLines = message.split('\n');
  const nameAndEmail = messageLines.slice(0, 2);
  const messageContent = messageLines.slice(3).join('\n');

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}>
        <h1 style={{
          fontSize: '24px',
          color: '#333',
          marginTop: '0',
          marginBottom: '20px',
          borderBottom: '1px solid #eaeaea',
          paddingBottom: '12px'
        }}>
          New Message from Portfolio
        </h1>
        
        <div style={{
          backgroundColor: '#f0f7ff',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #4f46e5',
        }}>
          {nameAndEmail.map((line, index) => (
            <p key={index} style={{
              margin: '5px 0',
              fontSize: '16px',
              color: '#333',
              fontWeight: index === 0 ? 'bold' : 'normal',
            }}>
              {line}
            </p>
          ))}
        </div>
        
        <div>
          <h2 style={{
            fontSize: '18px',
            margin: '20px 0 10px',
            color: '#4f46e5',
          }}>
            Message:
          </h2>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '6px',
            border: '1px solid #eaeaea',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
          }}>
            {messageContent}
          </div>
        </div>
        
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eaeaea',
          color: '#666',
          fontSize: '14px',
          textAlign: 'center' as const,
        }}>
          <p>This message was sent from your portfolio website contact form.</p>
        </div>
      </div>
    </div>
  );
};