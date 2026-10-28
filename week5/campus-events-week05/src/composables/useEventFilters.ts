import { ref, computed, unref } from "vue";
import type { CampusEvent } from "../types";

export function useEventFilters(events: any) {
  const search = ref("");
  const category = ref("");

  const visible = computed(() => {
    // unref() perfectly handles both Vue Refs and reactive Proxy arrays
    const list = unref(events) || [];
    const query = search.value.toLowerCase().trim();

    return list.filter((e: CampusEvent) => {
      // Fallback to empty strings to prevent crashes if a field is missing
      const title = (e.title || "").toLowerCase();
      const desc = (e.description || "").toLowerCase();
      const loc = (e.location || "").toLowerCase();

      // Search across all three text fields
      const matchesSearch = title.includes(query) || desc.includes(query) || loc.includes(query);
      
      const matchesCategory = category.value === "" || e.category === category.value;

      return matchesSearch && matchesCategory;
    });
  });

  return { search, category, visible };
}