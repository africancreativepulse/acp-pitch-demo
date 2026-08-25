import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { MAJOR_FIELDS, leavesByField, subCategoryById, type SubCategory } from "@/data/taxonomy";

/**
 * Ported structural pattern from the real app's own components/shared/
 * CategoryPicker.tsx -- same three modes, same core interaction (29
 * collapsed major-field groups, tap a field to expand its leaves, tap a
 * leaf chip to toggle it, African Diaspora rendered as two labeled
 * Geography/Topic sub-groups). What's NOT ported: the real component's
 * Radix Popover + cmdk search box -- neither is a dependency here (this
 * demo stays deliberately dependency-light, see README), and a text
 * search box would break this whole demo's own zero-typing rule anyway.
 * With a curated ~120-leaf set (vs. the real 220) organized into 29
 * always-visible field groups, tap-to-expand browsing genuinely doesn't
 * need search to stay usable -- so this renders inline (no overlay/
 * portal) rather than behind a popover trigger, the same "always-visible,
 * no floating panel" convention this demo's own Chip pickers already use
 * elsewhere (CampaignBuilder.tsx).
 *
 *  - "multi"    -- contributor badge picking (Onboarding), no cap, no nudge.
 *  - "campaign" -- campaign tagging (CampaignBuilder), no hard cap, soft
 *                  nudge past 3 selections.
 *  - "single"   -- a category filter, 0 or 1 selection, picking a new leaf
 *                  replaces the old one.
 */
export type CategoryPickerMode = "multi" | "campaign" | "single";

export interface CategoryPickerProps {
  mode: CategoryPickerMode;
  selected: string[];
  onChange: (ids: string[]) => void;
  accent: string;
  className?: string;
}

export function CategoryPicker({ mode, selected, onChange, accent, className }: CategoryPickerProps) {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const selectedItems = selected.map((id) => subCategoryById(id)).filter((x): x is SubCategory => !!x);

  function toggleFieldExpanded(fieldSlug: string) {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      next.has(fieldSlug) ? next.delete(fieldSlug) : next.add(fieldSlug);
      return next;
    });
  }

  function toggleLeaf(id: string) {
    if (mode === "single") {
      onChange(selected.includes(id) ? [] : [id]);
      return;
    }
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  function removeSelected(id: string) {
    onChange(selected.filter((x) => x !== id));
  }

  const showCampaignNudge = mode === "campaign" && selected.length > 3;
  const accentStyle = { ["--cp-accent" as string]: accent };

  return (
    <div className={cn("space-y-3", className)} style={accentStyle}>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs"
              style={{ borderColor: accent, color: accent }}
            >
              {item.name}
              <button type="button" onClick={() => removeSelected(item.id)} aria-label={`Remove ${item.name}`} className="opacity-70 transition-opacity hover:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {showCampaignNudge && (
        <p className="text-xs text-muted">
          Most campaigns need 1–3 tags — a narrower selection keeps the contributor match signal strong.
        </p>
      )}

      <div className="max-h-[420px] space-y-0.5 overflow-y-auto rounded border border-line p-1.5">
        {MAJOR_FIELDS.map((field) => {
          const fieldLeaves = leavesByField(field.slug);
          const expanded = expandedFields.has(field.slug);
          const selectedInField = fieldLeaves.filter((l) => selected.includes(l.id)).length;
          const isDiaspora = field.slug === "african_diaspora";

          return (
            <div key={field.slug}>
              <button
                type="button"
                onClick={() => toggleFieldExpanded(field.slug)}
                className="flex w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-[13px] font-medium text-paper transition-colors hover:bg-[color-mix(in_srgb,var(--cp-accent)_8%,transparent)]"
              >
                <span className="flex items-center gap-2">
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted transition-transform", !expanded && "-rotate-90")} />
                  {field.name}
                </span>
                {selectedInField > 0 && (
                  <span className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold" style={{ color: accent, backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)` }}>
                    {selectedInField}
                  </span>
                )}
              </button>

              {expanded && (
                <div className="px-2.5 pb-2.5 pt-1">
                  {isDiaspora ? (
                    <>
                      <DiasporaFacetGroup label="Geography" leaves={fieldLeaves.filter((l) => l.facet === "geography")} selected={selected} accent={accent} onToggle={toggleLeaf} />
                      <DiasporaFacetGroup label="Topic" leaves={fieldLeaves.filter((l) => l.facet === "topic")} selected={selected} accent={accent} onToggle={toggleLeaf} />
                    </>
                  ) : (
                    <LeafChips leaves={fieldLeaves} selected={selected} accent={accent} onToggle={toggleLeaf} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeafChips({ leaves, selected, accent, onToggle }: { leaves: SubCategory[]; selected: string[]; accent: string; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {leaves.map((leaf) => {
        const isSelected = selected.includes(leaf.id);
        return (
          <button
            key={leaf.id}
            type="button"
            onClick={() => onToggle(leaf.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              isSelected ? "hover:brightness-110" : "border-line text-muted hover:border-[var(--cp-accent)] hover:bg-[color-mix(in_srgb,var(--cp-accent)_10%,transparent)] hover:text-paper"
            )}
            style={isSelected ? { borderColor: accent, backgroundColor: accent, color: "var(--ink)" } : undefined}
          >
            {leaf.name}
          </button>
        );
      })}
    </div>
  );
}

// African Diaspora is the one field whose curated leaves carry a facet
// (geography/topic) -- see taxonomy.ts's own comment for why. Rendered as
// two labeled sub-groups purely as a display nuance, same as the real
// component; selection/toggle logic is identical to every other field.
function DiasporaFacetGroup({ label, leaves, selected, accent, onToggle }: { label: string; leaves: SubCategory[]; selected: string[]; accent: string; onToggle: (id: string) => void }) {
  if (leaves.length === 0) return null;
  return (
    <div className="mb-2 last:mb-0">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted/70">{label}</div>
      <LeafChips leaves={leaves} selected={selected} accent={accent} onToggle={onToggle} />
    </div>
  );
}
