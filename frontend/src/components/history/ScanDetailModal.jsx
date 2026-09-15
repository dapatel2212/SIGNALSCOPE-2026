import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { fetchScanDetail } from '../../lib/api';
import { ResultCard } from '../prediction/ResultCard';
import { Loader2 } from 'lucide-react';

export const ScanDetailModal = ({
  scanId,
  isOpen,
  onClose,
}) => {
  const [scan, setScan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || scanId === null) {
      setScan(null);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchScanDetail(scanId);
        setScan(data);
      } catch (err) {
        setError(err?.message || 'Failed to load scan record.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [scanId, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={scan ? `Scan Report #${scan.id}` : 'Inspection Detail'}
      maxWidth="max-w-4xl"
    >
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-[#3D5C49] dark:text-[#A8C7B8] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-[#21C58A]" />
          <span className="text-xs font-mono">Loading telemetry record...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-700/60 text-rose-800 dark:text-rose-200 text-xs shadow-xs">
          {error}
        </div>
      )}

      {!isLoading && scan && (
        <div className="max-h-[80vh] overflow-y-auto pr-1">
          <ResultCard scan={scan} onReset={onClose} />
        </div>
      )}
    </Modal>
  );
};
