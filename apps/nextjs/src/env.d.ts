// Extend the env type to include STRIPE_PRICE_ID
import { env } from "./env";

declare module "./env" {
  interface Env {
    STRIPE_PRICE_ID: string;
  }
}

export {}; 