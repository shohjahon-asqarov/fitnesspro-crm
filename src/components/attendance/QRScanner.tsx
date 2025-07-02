import React, { useState } from 'react';
import { QrCode, Scan } from 'lucide-react';
import Modal from '../common/Modal';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (memberId: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [scannedCode, setScannedCode] = useState('');

  // Mock QR scanner - real implementation would use camera
  const handleManualInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedCode.trim()) {
      onScan(scannedCode.trim());
      setScannedCode('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Kod Skaner" size="md">
      <div className="space-y-6">
        {/* Mock Camera View */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <QrCode size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              QR kodni kameraga tutib ko'rsating
            </p>
            <p className="text-xs text-gray-400">
              Haqiqiy loyihada kamera ishlatiladi
            </p>
          </div>
        </div>

        {/* Manual Input for Demo */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Yoki qo'lda kiriting (demo uchun):
          </h3>
          <form onSubmit={handleManualInput} className="flex gap-2">
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              placeholder="A'zo ID yoki QR kod..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!scannedCode.trim()}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Scan size={16} />
              Skanerlash
            </button>
          </form>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <strong>Demo uchun:</strong> A'zo ID larini kiriting (masalan: 1, 2, 3, 4) yoki 
          Members bo'limidan a'zo ID sini ko'ring.
        </div>
      </div>
    </Modal>
  );
}