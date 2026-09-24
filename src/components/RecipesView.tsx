import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Recipe, RecipeIngredient, ProductCategory } from '../types/bakery';
import { 
  BookOpen, 
  Plus, 
  Scale, 
  DollarSign, 
  Clock, 
  Flame, 
  Percent, 
  ChevronRight, 
  X, 
  Check,
  TrendingUp
} from 'lucide-react';

export const RecipesView: React.FC = () => {
  const { 
    recipes, 
    ingredients, 
    products, 
    calculateRecipeCost, 
    addRecipe, 
    settings 
  } = useBakery();

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || '');
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);
  const [customYieldInput, setCustomYieldInput] = useState<string>('');
  
  // New Recipe Modal State
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('breads');
  const [newBaseYield, setNewBaseYield] = useState(12);
  const [newYieldUnit, setNewYieldUnit] = useState('loaves');
  const [newPrepMinutes, setNewPrepMinutes] = useState(180);
  const [newBakeMinutes, setNewBakeMinutes] = useState(35);
  const [newBakeTempC, setNewBakeTempC] = useState(230);
  const [newInstructions, setNewInstructions] = useState('');
  const [newBakerNotes, setNewBakerNotes] = useState('');
  const [newIngredientsList, setNewIngredientsList] = useState<{
    ingredientId: string;
    amount: number;
    unit: string;
    isFlour: boolean;
  }[]>([
    { ingredientId: ingredients[0]?.id || '', amount: 1000, unit: 'g', isFlour: true }
  ]);

  const activeRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

  // Calculate base flour weight for Baker's % calculation
  const baseFlourWeight = activeRecipe?.ingredients
    .filter(i => i.isFlour)
    .reduce((sum, i) => sum + i.amount, 0) || 1;

  // Linked retail product for margin comparison
  const linkedProduct = products.find(p => p.recipeId === activeRecipe?.id);

  // Financial costing
  const baseCost = activeRecipe ? calculateRecipeCost(activeRecipe) : { totalCost: 0, costPerUnit: 0 };
  const scaledCost = baseCost.costPerUnit * (activeRecipe?.baseYield || 1) * scaleMultiplier;
  const retailPrice = linkedProduct?.price || (baseCost.costPerUnit * 3.5);
  const marginPercent = retailPrice > 0 ? ((retailPrice - baseCost.costPerUnit) / retailPrice) * 100 : 0;
  const foodCostRatio = retailPrice > 0 ? (baseCost.costPerUnit / retailPrice) * 100 : 0;

  const handleAddIngredientRow = () => {
    setNewIngredientsList(prev => [
      ...prev,
      { ingredientId: ingredients[0]?.id || '', amount: 100, unit: 'g', isFlour: false }
    ]);
  };

  const handleRemoveIngredientRow = (index: number) => {
    setNewIngredientsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const formattedIngredients: RecipeIngredient[] = newIngredientsList.map(item => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      return {
        ingredientId: item.ingredientId,
        name: ing?.name || 'Ingredient',
        amount: item.amount,
        unit: item.unit,
        isFlour: item.isFlour
      };
    });

    const parsedInstructions = newInstructions
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    addRecipe({
      name: newName,
      category: newCategory,
      baseYield: newBaseYield,
      yieldUnit: newYieldUnit,
      preparationMinutes: newPrepMinutes,
      bakeMinutes: newBakeMinutes,
      bakeTempC: newBakeTempC,
      ingredients: formattedIngredients,
      instructions: parsedInstructions.length > 0 ? parsedInstructions : ['Mix, ferment, shape, and bake.'],
      bakerNotes: newBakerNotes || undefined
    });

    setIsAddRecipeOpen(false);
    // Reset form
    setNewName('');
    setNewInstructions('');
    setNewBakerNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
            <span>Formulas & Costing</span>
            <span aria-hidden="true">·</span>
            <span>Baker's Math (100% Flour Basis)</span>
            <span aria-hidden="true">·</span>
            <span>{recipes.length} standard formulas</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Artisan Formulas & Margin Costing
          </h1>
        </div>

        <button
          onClick={() => setIsAddRecipeOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Formula</span>
        </button>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Formula List Selector */}
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Bakery Formula Catalog
          </h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
            {recipes.map((recipe) => {
              const isSelected = recipe.id === activeRecipe?.id;
              const cost = calculateRecipeCost(recipe);

              return (
                <button
                  key={recipe.id}
                  onClick={() => {
                    setSelectedRecipeId(recipe.id);
                    setScaleMultiplier(1);
                    setCustomYieldInput('');
                  }}
                  className={`w-full text-left p-4 transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected ? 'bg-amber-50/70 border-l-4 border-l-amber-800' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                      {recipe.category}
                    </span>
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-amber-950 font-bold' : 'text-stone-900'}`}>
                      {recipe.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      Yield: {recipe.baseYield} {recipe.yieldUnit} · {settings.currencySymbol}{cost.costPerUnit.toFixed(2)}/unit
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-800' : 'text-stone-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Formula Card, Baker's Percentages & Scaler */}
        {activeRecipe && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Detail Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs font-mono uppercase text-amber-800 tracking-wider">
                    {activeRecipe.category}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                    {activeRecipe.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      Ferment/Prep: {activeRecipe.preparationMinutes} min
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Flame className="w-3.5 h-3.5 text-stone-400" />
                      Deck: {activeRecipe.bakeTempC}°C for {activeRecipe.bakeMinutes} min
                    </span>
                  </div>
                </div>

                {/* Financial Margin Card */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 shrink-0 text-right">
                  <div className="text-[11px] text-stone-500 font-mono uppercase">Batch Costing</div>
                  <div className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                    {settings.currencySymbol}{baseCost.costPerUnit.toFixed(2)}{' '}
                    <span className="text-xs text-stone-400 font-normal font-sans">per {activeRecipe.yieldUnit.split(' ')[0]}</span>
                  </div>
                  <div className="text-xs font-mono mt-1 text-emerald-800 font-semibold flex items-center justify-end gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Margin: {marginPercent.toFixed(1)}%</span>
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono">
                    Food cost: {foodCostRatio.toFixed(1)}% of {settings.currencySymbol}{retailPrice.toFixed(2)} retail
                  </div>
                </div>
              </div>

              {/* Dynamic Batch Scaler Controls */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <Scale className="w-4 h-4 text-amber-800" />
                    <span>Batch Multiplier & Scale Calculator</span>
                  </div>
                  <span className="text-xs font-mono text-stone-600">
                    Scaled Output: <strong className="text-stone-900">{Math.round(activeRecipe.baseYield * scaleMultiplier)} {activeRecipe.yieldUnit}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[0.5, 1, 2, 3, 5].map((mult) => (
                    <button
                      key={mult}
                      onClick={() => {
                        setScaleMultiplier(mult);
                        setCustomYieldInput('');
                      }}
                      className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                        scaleMultiplier === mult && !customYieldInput
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {mult}x ({Math.round(activeRecipe.baseYield * mult)} {activeRecipe.yieldUnit.split(' ')[0]})
                    </button>
                  ))}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-xs text-stone-500 font-mono">Custom target:</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 48"
                      value={customYieldInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomYieldInput(val);
                        const count = parseInt(val) || activeRecipe.baseYield;
                        setScaleMultiplier(count / activeRecipe.baseYield);
                      }}
                      className="w-20 px-2 py-1 text-xs font-mono bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>
              </div>

              {/* Baker's Percentage & Ingredient Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900">
                    Formula Ingredients & Baker's Percentages
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">
                    Total Flour: {Math.round(baseFlourWeight * scaleMultiplier)}g (100.0%)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
                    <thead className="bg-stone-50 font-semibold text-stone-600 border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Ingredient</th>
                        <th className="py-2.5 px-3 text-right">Scaled Amount</th>
                        <th className="py-2.5 px-3 text-right">Baker's %</th>
                        <th className="py-2.5 px-3 text-right">Unit Cost</th>
                        <th className="py-2.5 px-3 text-right">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono">
                      {activeRecipe.ingredients.map((item) => {
                        const ing = ingredients.find(i => i.id === item.ingredientId);
                        const scaledAmount = Math.round(item.amount * scaleMultiplier * 10) / 10;
                        
                        // Baker's % calculation: (ingredient weight / total flour weight) * 100
                        const bakersPercent = item.unit === 'g' || item.unit === 'ml'
                          ? ((item.amount / baseFlourWeight) * 100).toFixed(1)
                          : '—';

                        let multiplier = 1;
                        if (ing?.unit === 'kg' && item.unit === 'g') multiplier = scaledAmount / 1000;
                        else if (ing?.unit === 'L' && item.unit === 'ml') multiplier = scaledAmount / 1000;
                        else multiplier = scaledAmount;

                        const lineCost = (ing?.costPerUnit || 0) * multiplier;

                        return (
                          <tr key={item.ingredientId} className={item.isFlour ? 'bg-amber-50/30 font-semibold' : ''}>
                            <td className="py-2.5 px-3 font-sans text-stone-900 flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.isFlour && (
                                <span className="text-[10px] text-amber-800 font-mono bg-amber-100 px-1.5 py-0.2 rounded">
                                  Flour Basis
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right text-stone-900 font-bold tabular-nums">
                              {scaledAmount} {item.unit}
                            </td>
                            <td className="py-2.5 px-3 text-right text-stone-600 tabular-nums">
                              {bakersPercent !== '—' ? `${bakersPercent}%` : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right text-stone-500 tabular-nums">
                              {settings.currencySymbol}{ing?.costPerUnit.toFixed(2)}/{ing?.unit}
                            </td>
                            <td className="py-2.5 px-3 text-right text-stone-900 font-bold tabular-nums">
                              {settings.currencySymbol}{lineCost.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-stone-50 font-bold border-t border-stone-200">
                      <tr>
                        <td className="py-2.5 px-3 text-stone-900 font-sans" colSpan={4}>
                          Total Batch Cost ({Math.round(activeRecipe.baseYield * scaleMultiplier)} {activeRecipe.yieldUnit})
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-stone-900 tabular-nums">
                          {settings.currencySymbol}{scaledCost.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Instructions & Baker's Method */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-900">
                  Step-by-Step Method & Technique
                </h3>
                <ol className="space-y-2 text-xs text-stone-700 list-decimal list-inside pl-1">
                  {activeRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="font-sans ml-1">{step}</span>
                    </li>
                  ))}
                </ol>

                {activeRecipe.bakerNotes && (
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 mt-2">
                    <strong className="text-stone-900 block mb-0.5">Head Baker Note:</strong>
                    {activeRecipe.bakerNotes}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Add Recipe Modal */}
      {isAddRecipeOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-mono uppercase text-amber-800">Formula Master</span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Create New Bakery Formula
                </h3>
              </div>
              <button
                onClick={() => setIsAddRecipeOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipe} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Formula Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Cranberry Walnut Sourdough"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  >
                    <option value="breads">Artisan Breads</option>
                    <option value="viennoiserie">Viennoiserie</option>
                    <option value="patisserie">Patisserie & Tarts</option>
                    <option value="savory">Savory Bakes</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Base Yield
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newBaseYield}
                    onChange={(e) => setNewBaseYield(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Yield Unit
                  </label>
                  <input
                    type="text"
                    value={newYieldUnit}
                    onChange={(e) => setNewYieldUnit(e.target.value)}
                    placeholder="loaves, pcs, sheet pans"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Deck Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={newBakeTempC}
                    onChange={(e) => setNewBakeTempC(parseInt(e.target.value) || 200)}
                    className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              {/* Ingredients Builder */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">
                    Ingredients List (Weight & Flour Flags)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddIngredientRow}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Ingredient</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newIngredientsList.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-200">
                      <select
                        value={row.ingredientId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewIngredientsList(prev => prev.map((item, i) => i === idx ? { ...item, ingredientId: val } : item));
                        }}
                        className="flex-1 px-2 py-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                      >
                        {ingredients.map(ing => (
                          <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={row.amount}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setNewIngredientsList(prev => prev.map((item, i) => i === idx ? { ...item, amount: val } : item));
                        }}
                        placeholder="Qty"
                        className="w-20 px-2 py-1.5 text-xs font-mono bg-white border border-stone-300 rounded"
                      />

                      <select
                        value={row.unit}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewIngredientsList(prev => prev.map((item, i) => i === idx ? { ...item, unit: val } : item));
                        }}
                        className="w-16 px-1 py-1.5 text-xs bg-white border border-stone-300 rounded"
                      >
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                      </select>

                      <label className="flex items-center gap-1 text-[11px] text-stone-600 shrink-0">
                        <input
                          type="checkbox"
                          checked={row.isFlour}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setNewIngredientsList(prev => prev.map((item, i) => i === idx ? { ...item, isFlour: val } : item));
                          }}
                          className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                        />
                        <span>Is Flour</span>
                      </label>

                      {newIngredientsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredientRow(idx)}
                          className="p-1 text-stone-400 hover:text-stone-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Method Steps (One per line)
                </label>
                <textarea
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="1. Autolyse flour and water for 45 mins&#10;2. Add levain and salt&#10;3. Bulk ferment 4 hours with 3 coil folds"
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddRecipeOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg"
                >
                  Save Formula
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
