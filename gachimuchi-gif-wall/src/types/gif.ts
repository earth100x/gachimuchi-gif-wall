/**
 * GIF data model interface
 * Represents a single GIF from the Tenor API
 */
export interface GIF {
  id: string;
  title: string;
  url: string;
  preview: string;
  dimensions: {
    width: number;
    height: number;
  };
  created: string;
}
