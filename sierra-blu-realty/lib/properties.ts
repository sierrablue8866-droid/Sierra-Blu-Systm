import type { Property, PropertyType, OfferType } from "./firestore";

export const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "fallback-1",
    referenceNumber: "SB-514",
    title: "Serenity Court Villa",
    description:
      "A sculpted private villa in Fifth Settlement with double-height reception spaces, quiet garden courtyards, and hospitality-grade finishes throughout.",
    propertyType: "VI",
    offerType: "RS",
    price: 38500000,
    city: "Cairo",
    community: "New Cairo",
    subCommunity: "Fifth Settlement",
    bedrooms: 5,
    bathrooms: 6,
    size: 520,
    agentRef: "fallback-layla",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-c7f34a92d7c6?q=80&w=2070&auto=format&fit=crop",
    ],
    facilities: [
      "Private Pool",
      "Smart Home Automation",
      "Formal Entertaining Salon",
      "Staff Quarters",
    ],
    updatedAt: "2026-03-22T00:00:00.000Z",
  },
  {
    id: "fallback-2",
    referenceNumber: "SB-532",
    title: "Luma Residence",
    description:
      "A refined apartment with panoramic terraces, warm stone detailing, and a quiet position inside Lake View with fast access to central New Cairo.",
    propertyType: "AP",
    offerType: "RS",
    price: 17900000,
    city: "Cairo",
    community: "New Cairo",
    subCommunity: "Lake View",
    bedrooms: 3,
    bathrooms: 3,
    size: 240,
    agentRef: "fallback-karim",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop",
    ],
    facilities: ["Club Access", "Underground Parking", "Guest Powder Room", "Open Terrace"],
    updatedAt: "2026-03-22T00:00:00.000Z",
  },
  {
    id: "fallback-3",
    referenceNumber: "SB-701",
    title: "Terrace Suites",
    description:
      "A light-filled family residence in Katameya Heights with layered terraces, private guest accommodations, and a strong rental-resale profile.",
    propertyType: "AP",
    offerType: "RS",
    price: 26200000,
    city: "Cairo",
    community: "New Cairo",
    subCommunity: "Katameya Heights",
    bedrooms: 4,
    bathrooms: 4,
    size: 310,
    agentRef: "fallback-nour",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2070&auto=format&fit=crop",
    ],
    facilities: ["Roof Terrace", "Family Lounge", "Concierge Access", "Storage Room"],
    updatedAt: "2026-03-22T00:00:00.000Z",
  },
];

const propertyTypeLabels: Record<PropertyType, string> = {
  AP: "Apartment",
  VI: "Villa",
  TH: "Townhouse",
  PH: "Penthouse",
};

const offerTypeLabels: Record<OfferType, string> = {
  RS: "For Sale",
  RR: "For Rent",
  CS: "Commercial Sale",
  CR: "Commercial Rent",
};

export const resolveProperties = (properties: Property[]): Property[] =>
  properties.length > 0 ? properties : FALLBACK_PROPERTIES;

export const normalizePropertyIdentifier = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export const findPropertyByIdentifier = (
  properties: Property[],
  identifier: string,
): Property | undefined => {
  const normalizedIdentifier = normalizePropertyIdentifier(identifier);

  return resolveProperties(properties).find((property) => {
    const candidates = [property.id, property.referenceNumber]
      .filter((candidate): candidate is string => Boolean(candidate))
      .map(normalizePropertyIdentifier);

    return candidates.includes(normalizedIdentifier);
  });
};

export const getPropertyHref = (property: Property): string =>
  `/listings/${encodeURIComponent(property.referenceNumber)}`;

export const getPrimaryPropertyImage = (property: Property): string =>
  property.images[0] ?? FALLBACK_PROPERTIES[0]!.images[0]!;

export const formatPropertyType = (type: PropertyType): string => propertyTypeLabels[type];

export const formatOfferType = (type: OfferType): string => offerTypeLabels[type];

export const formatPropertyPrice = (price: number): string =>
  `EGP ${price.toLocaleString()}`;
