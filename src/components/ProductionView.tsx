import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ProductionBatch, BatchStage } from '../types/bakery';
import { 
  Flame, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Sliders, 
  Check, 
  X,
  Send,
  Sparkles
} from 'lucide-react';

interface ProductionViewProps {
  isNewBatchModalOpen: boolean;
  setIsNewBatchModalOpen: (open: boolean) => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({ 
  isNewBatchModalOpen, 
  setIsNewBatchModalOpen 
}) => {
  const { 
    batches, 
    recipes, 
    updateBatchStage, 
    toggleBatchTimer, 
    resetBatchTimer, 
    sendBatchToCounter,
    addBatch
  } = useBakery();

  const [filterStage, setFilterStage] = useState<string>('all');
  
  // New batch modal state
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || '');
  const [targetYield, setTargetYield] = useState<number>(24);
  const [scheduledTime, setScheduledTime] = useState<string>('06:00');
  const [assignedBaker, setAssignedBaker] = useState<string>('Julian');
  const [batchNotes, setBatchNotes] = useState<string>('');

  // Actual yield modal state
  const [batchToYield, setBatchToYield] = useState<ProductionBatch | null>(null);
  const [inputActualYield, setInputActualYield] = useState<number>(0);
  const [inputWasteYield, setInputWasteYield] = useState<number>(0);

  const stages: { id: BatchStage; label: string }[] = [
    { id: 'scheduled', label: '1. Scheduled' },
    { id: 'mixing', label: '2. Mixing & Knead' },
    { id: 'proofing', label: '3. Bulk/Final Proof' },
    { id: 'baking', label: '4. In Oven' },
    { id: 'cooling', label: '5. Cooling Racks' },
    { id: 'ready', label: '6. Ready for Counter' },
    { id: 'completed', label: '7. Archived' }
  ];

  const filteredBatches = batches.filter(b => {
    if (filterStage === 'all') return true;
    if (filterStage === 'active') return b.stage !== 'completed';
    return b.stage === filterStage;
  });

  const getNextStage = (current: BatchStage): BatchStage => {
    switch (current) {
      case 'scheduled': return 'mixing';
      case 'mixing': return 'proofing';
      case 'proofing': return 'baking';
      case 'baking': return 'cooling';
      case 'cooling': return 'ready';
      case 'ready': return 'completed';
      default: return 'completed';
    }
  };

  const getNextStageActionText = (current: BatchStage): string => {
    switch (current) {
      case 'scheduled': return 'Start Mixing';
      case 'mixing': return 'Move to Proofer';
      case 'proofing': return 'Load into Deck Oven';
      case 'baking': return 'Pull to Cooling Rack';
      case 'cooling': return 'Mark Ready & Count Yield';
      case 'ready': return 'Send to Counter POS';
      default: return 'Done';
    }
  };

  const handleStageAdvance = (batch: ProductionBatch) => {
    if (batch.stage === 'cooling') {
      // Prompt for actual yield verification
      setBatchToYield(batch);
      setInputActualYield(batch.targetYield);
      setInputWasteYield(0);
    } else if (batch.stage === 'ready') {
      sendBatchToCounter(batch.id);
    } else {
      updateBatchStage(batch.id, getNextStage(batch.stage));
    }
  };

  const handleConfirmYield = () => {
    if (batchToYield) {
      updateBatchStage(batchToYield.id, 'ready', inputActualYield, inputWasteYield);
      setBatchToYield(null);
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const recipe = recipes.find(r => r.id === selectedRecipeId);
    if (!recipe) return;

    addBatch({
      recipeId: recipe.id,
      recipeName: recipe.name,
      scheduledTime,
      targetYield,
      stage: 'scheduled',
      assignedBaker,
      notes: batchNotes || undefined
    });

    setIsNewBatchModalOpen(false);
    setBatchNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Bakehouse Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Bakehouse Operations</span>
            <span aria-hidden="true">·</span>
            <span>Deck Ovens & Proofers</span>
            <span aria-hidden="true">·</span>
            <span>{batches.filter(b => b.stage !== 'completed').length} active batches</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Daily Baking & Production Schedule
          </h1>
        </div>

        <button
          onClick={() => setIsNewBatchModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Batch</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
        <button
          onClick={() => setFilterStage('all')}
          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filterStage === 'all'
              ? 'bg-stone-900 text-white border-stone-900 font-semibold'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
        >
          All Batches ({batches.length})
        </button>
        <button
          onClick={() => setFilterStage('active')}
          className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            filterStage === 'active'
              ? 'bg-amber-900 text-white border-amber-900 font-semibold'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
        >
          Active in Kitchen ({batches.filter(b => b.stage !== 'completed').length})
        </button>
        {stages.slice(0, 6).map((st) => {
          const count = batches.filter(b => b.stage === st.id).length;
          return (
            <button
              key={st.id}
              onClick={() => setFilterStage(st.id)}
              className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                filterStage === st.id
                  ? 'bg-stone-800 text-white border-stone-800 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {st.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Production Batch Cards List */}
      <div className="space-y-4">
        {filteredBatches.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
            <Flame className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-700">No batches match this filter</p>
            <p className="text-xs text-stone-400 mt-1">Schedule a new batch using the button above.</p>
          </div>
        ) : (
          filteredBatches.map((batch) => {
            const recipe = recipes.find(r => r.id === batch.recipeId);
            const isBaking = batch.stage === 'baking';
            const isReady = batch.stage === 'ready';
            const isCompleted = batch.stage === 'completed';

            return (
              <div
                key={batch.id}
                className={`bg-white rounded-xl border transition-all p-5 ${
                  isBaking
                    ? 'border-amber-400 shadow-xs'
                    : isReady
                    ? 'border-emerald-300'
                    : 'border-stone-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Batch Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="font-mono font-semibold text-stone-800">{batch.batchNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {batch.scheduledTime}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Baker: <strong>{batch.assignedBaker || 'Bakery Team'}</strong></span>
                      {recipe && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-stone-600">
                            Deck: {recipe.bakeTempC}°C ({recipe.bakeMinutes}m bake)
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-serif text-xl font-bold text-stone-900">
                      {batch.recipeName}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                      <span>Target Yield: <strong className="font-mono font-semibold">{batch.targetYield} {recipe?.yieldUnit || 'units'}</strong></span>
                      {batch.actualYield !== undefined && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-800 font-semibold font-mono">
                            Actual Yield: {batch.actualYield} units
                          </span>
                        </>
                      )}
                      {batch.wasteYield !== undefined && batch.wasteYield > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-800 font-mono">
                            Loss: {batch.wasteYield} units
                          </span>
                        </>
                      )}
                    </div>

                    {batch.notes && (
                      <p className="text-xs text-stone-500 italic mt-1 bg-stone-50 p-2 rounded-lg border border-stone-100 max-w-2xl">
                        Baker's log: "{batch.notes}"
                      </p>
                    )}
                  </div>

                  {/* Right: Stage Badge & Active Timer & Stage Stepper */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                    
                    {/* Live Oven Timer (if baking) */}
                    {isBaking && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                        <Flame className="w-5 h-5 text-amber-700 animate-pulse" />
                        <div>
                          <div className="text-[10px] font-mono text-amber-800 uppercase tracking-wider">Deck Oven Timer</div>
                          <div className="text-lg font-mono font-bold text-amber-950 tabular-nums">
                            {Math.floor(batch.timerMinutesRemaining || 0)}:
                            {Math.round(((batch.timerMinutesRemaining || 0) % 1) * 60).toString().padStart(2, '0')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => toggleBatchTimer(batch.id)}
                            className="p-1.5 bg-amber-200/70 hover:bg-amber-200 text-amber-950 rounded-lg cursor-pointer"
                            title={batch.timerRunning ? 'Pause' : 'Start'}
                          >
                            {batch.timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => resetBatchTimer(batch.id, recipe?.bakeMinutes || 25)}
                            className="p-1.5 bg-amber-200/70 hover:bg-amber-200 text-amber-950 rounded-lg cursor-pointer"
                            title="Reset Timer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage & Progress Action */}
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-stone-100 rounded-md text-stone-800">
                          {batch.stage.toUpperCase()}
                        </span>
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => handleStageAdvance(batch)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isReady
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : isBaking
                              ? 'bg-amber-800 hover:bg-amber-900 text-white'
                              : 'bg-stone-900 hover:bg-stone-800 text-white'
                          }`}
                        >
                          {isReady ? <Send className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{getNextStageActionText(batch.stage)}</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-mono text-stone-400">
                          Archived · Delivered to counter
                        </span>
                      )}
                    </div>

                  </div>

                </div>

                {/* Visual Stage Progress Line */}
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <div className="grid grid-cols-6 gap-1 text-[11px] font-mono">
                    {stages.slice(0, 6).map((st, i) => {
                      const stageIdx = stages.findIndex(s => s.id === batch.stage);
                      const isPastOrCurrent = stageIdx >= i;
                      const isCurrent = batch.stage === st.id;

                      return (
                        <div key={st.id} className="flex flex-col gap-1">
                          <div
                            className={`h-1.5 rounded-full transition-colors ${
                              isCurrent
                                ? 'bg-amber-700'
                                : isPastOrCurrent
                                ? 'bg-stone-900'
                                : 'bg-stone-100'
                            }`}
                          />
                          <span className={`truncate ${isCurrent ? 'font-bold text-stone-900' : 'text-stone-400'}`}>
                            {st.label.split('. ')[1]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Yield Verification Modal */}
      {batchToYield && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono text-amber-800">Quality Inspection & Counter Yield</span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {batchToYield.recipeName}
                </h3>
              </div>
              <button
                onClick={() => setBatchToYield(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Target batch yield was <strong className="font-mono">{batchToYield.targetYield} units</strong>. Confirm how many passed visual QA and are ready for sellable counter display.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Good Quality Loaves / Pastries (Saleable)
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputActualYield}
                  onChange={(e) => setInputActualYield(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Damaged / Test Bake / Scrap Units (Loss)
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputWasteYield}
                  onChange={(e) => setInputWasteYield(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setBatchToYield(null)}
                className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmYield}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
              >
                Confirm Yield & Set Ready
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule New Batch Modal */}
      {isNewBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono uppercase text-amber-800">Bakehouse Production</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Schedule New Production Batch
                </h3>
              </div>
              <button
                onClick={() => setIsNewBatchModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Select Recipe Formula
                </label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => {
                    setSelectedRecipeId(e.target.value);
                    const r = recipes.find(rec => rec.id === e.target.value);
                    if (r) setTargetYield(r.baseYield);
                  }}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Base: {r.baseYield} {r.yieldUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Target Output Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={targetYield}
                    onChange={(e) => setTargetYield(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Scheduled Bake Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Assigned Baker / Station
                </label>
                <input
                  type="text"
                  value={assignedBaker}
                  onChange={(e) => setAssignedBaker(e.target.value)}
                  placeholder="e.g. Julian, Claire, Bread Deck #1"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Batch Notes (Hydration, Flour lot, ambient temp)
                </label>
                <textarea
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="e.g. Room at 24°C, 78% hydration autolyse for 45 mins"
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Raw Material Auto-Deduct:</strong> Scheduling this batch will automatically reserve and decrement calculated flour, butter, and yeast quantities from your pantry inventory.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewBatchModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg cursor-pointer"
                >
                  Schedule Batch
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
