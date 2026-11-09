/** A category, technology or measurement type, including nested product references. */
export interface ProductTaxonomy {
  // Some nested references have no Tridion identifier, even when the root entry does.
  readonly keywordTcmId: string | null;
  readonly id: string;
  readonly title: string;
  readonly pagetitle: string;
  readonly strapline: string | null;
  readonly image: string;
  readonly url: string;
  readonly shortName: string | null;
  readonly metaPageTypeTag: string;
}

/** A supplied product record. Source field names and string identifiers are retained. */
export interface Product {
  readonly productLinkingId: string;
  // The source supplies numeric strings or an empty string; no ordering is inferred here.
  readonly productOrderNumber: string;
  readonly keywordTcmId: string;
  readonly id: string;
  readonly title: string;
  readonly strapline: string;
  readonly image: string;
  readonly url: string;
  readonly isproduct: boolean;
  readonly technologies: readonly ProductTaxonomy[];
  readonly categories: readonly ProductTaxonomy[];
  // Preserve the source spelling, which differs from the root measurementTypes collection.
  readonly measTypes: readonly ProductTaxonomy[];
  // Every supplied value is null; a promotion structure cannot be inferred from this file.
  readonly promotions: null;
}

/** The complete source document, including provenance and supporting collections. */
export interface ProductDataset {
  readonly metadata: {
    readonly sourceUrl: string;
    readonly extractedAt: string;
    readonly description: string;
    readonly counts: {
      readonly products: number;
      readonly categories: number;
      readonly technologies: number;
      readonly measurementTypes: number;
    };
  };
  readonly products: readonly Product[];
  readonly categories: readonly ProductTaxonomy[];
  readonly technologies: readonly ProductTaxonomy[];
  readonly measurementTypes: readonly ProductTaxonomy[];
}
