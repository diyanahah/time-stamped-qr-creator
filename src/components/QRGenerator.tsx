
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Calendar, Clock, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const { toast } = useToast();

  const generateQR = async (inputText: string) => {
    if (!inputText.trim()) {
      setQrCode('');
      setGeneratedAt(null);
      return;
    }

    try {
      const qrDataURL = await QRCode.toDataURL(inputText, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff',
        },
      });
      setQrCode(qrDataURL);
      setGeneratedAt(new Date());
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQR(text);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [text]);

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    }
  };

  const downloadQR = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = qrCode;
      link.click();
      toast({
        title: "Downloaded!",
        description: "QR code saved to your device",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              QR Code Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Generate QR codes instantly with timestamp tracking
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Enter Your Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter text, URL, or any content..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="text-lg p-4 border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-colors"
                />
                {text && (
                  <Button
                    onClick={copyToClipboard}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 text-gray-500 hover:text-purple-600"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {generatedAt && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Generated on:</span>
                    <span>{formatDate(generatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Time:</span>
                    <span>{formatTime(generatedAt)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code Output Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Generated QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              {qrCode ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-2xl shadow-lg">
                      <img
                        src={qrCode}
                        alt="Generated QR Code"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      onClick={downloadQR}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <QrCode className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Enter text to generate QR code</p>
                  <p className="text-sm">Your QR code will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        {generatedAt && (
          <Card className="mt-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {text.length}
                  </div>
                  <div className="text-sm text-gray-600">Characters</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(generatedAt)}
                  </div>
                  <div className="text-sm text-gray-600">Generated At</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-indigo-600">
                    PNG
                  </div>
                  <div className="text-sm text-gray-600">Format</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
