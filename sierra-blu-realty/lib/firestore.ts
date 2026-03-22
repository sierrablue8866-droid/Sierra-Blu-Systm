import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseApp } from "./firebase";

const app = getFirebaseApp();
export const db = getFirestore(app);

export interface Agent {
  id?: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
  specialties: string[];
  bio: string;
  createdAt?: Timestamp;
}

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const mapAgent = (id: string, data: Record<string, unknown>): Agent => ({
  id,
  name: asString(data.name, "Advisor"),
  role: asString(data.role, "Private Advisor"),
  image: asString(data.image),
  phone: asString(data.phone),
  email: asString(data.email),
  specialties: asStringArray(data.specialties),
  bio: asString(data.bio),
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
});

export const getAgents = async () => {
  const agentsCol = collection(db, "agents");
  const agentsQuery = query(agentsCol, orderBy("name", "asc"));
  const agentsSnapshot = await getDocs(agentsQuery);
  return agentsSnapshot.docs.map((doc) =>
    mapAgent(doc.id, doc.data() as Record<string, unknown>),
  );
};

export const addAgent = async (agent: Omit<Agent, "id">) => {
  const agentsCol = collection(db, "agents");
  return await addDoc(agentsCol, {
    ...agent,
    createdAt: Timestamp.now(),
  });
};

export type PropertyType = "AP" | "VI" | "TH" | "PH";
export type OfferType = "RS" | "RR" | "CS" | "CR";

export interface Property {
  id?: string;
  referenceNumber: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  offerType: OfferType;
  price: number;
  city: string;
  community: string;
  subCommunity?: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  agentRef: string; // Reference to Agent ID
  images: string[];
  facilities?: string[];
  updatedAt: string; // ISO 8601 Date String
}

const isPropertyType = (value: unknown): value is PropertyType =>
  value === "AP" || value === "VI" || value === "TH" || value === "PH";

const isOfferType = (value: unknown): value is OfferType =>
  value === "RS" || value === "RR" || value === "CS" || value === "CR";

const mapProperty = (id: string, data: Record<string, unknown>): Property => ({
  id,
  referenceNumber: asString(data.referenceNumber, id),
  title: asString(data.title, "Untitled Property"),
  description: asString(data.description, "Property details are being prepared."),
  propertyType: isPropertyType(data.propertyType) ? data.propertyType : "AP",
  offerType: isOfferType(data.offerType) ? data.offerType : "RS",
  price: asNumber(data.price),
  city: asString(data.city, "Cairo"),
  community: asString(data.community, "New Cairo"),
  subCommunity: asString(data.subCommunity),
  bedrooms: asNumber(data.bedrooms),
  bathrooms: asNumber(data.bathrooms),
  size: asNumber(data.size),
  agentRef: asString(data.agentRef),
  images: asStringArray(data.images),
  facilities: asStringArray(data.facilities),
  updatedAt: asString(data.updatedAt, new Date().toISOString()),
});

export const getProperties = async (): Promise<Property[]> => {
  try {
    const propertiesCol = collection(db, "properties");
    const propertiesSnapshot = await getDocs(propertiesCol);
    return propertiesSnapshot.docs.map((doc) =>
      mapProperty(doc.id, doc.data() as Record<string, unknown>),
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};
