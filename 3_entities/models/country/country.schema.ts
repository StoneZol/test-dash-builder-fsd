import { z } from 'zod';

/** Raw REST Countries v5 object (subset we request via response_fields). */
export const countryV5Schema = z.object({
  names: z.object({
    common: z.string(),
    official: z.string().optional().default(''),
  }),
  codes: z.object({
    alpha_3: z.string(),
  }),
  population: z.number().optional().default(0),
  region: z.string().optional().default(''),
  capitals: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional()
    .default([]),
  flag: z
    .object({
      url_png: z.string().optional(),
      url_svg: z.string().optional(),
      emoji: z.string().optional(),
    })
    .optional(),
});

export const countriesV5ResponseSchema = z.object({
  data: z.object({
    objects: z.array(countryV5Schema),
    meta: z
      .object({
        more: z.boolean().optional(),
        total: z.number().optional(),
      })
      .optional(),
  }),
});

/** Single-country upstream payload (`/codes.alpha_3/{code}` or list with one hit). */
export const countryV5DetailResponseSchema = z.union([
  z.object({ data: countryV5Schema }),
  countriesV5ResponseSchema,
]);

/** Domain model used by widgets (stable, UI-friendly). */
export const countrySchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
  }),
  cca3: z.string(),
  population: z.number(),
  region: z.string(),
  capital: z.array(z.string()).default([]),
  flags: z
    .object({
      png: z.string().optional(),
      svg: z.string().optional(),
      alt: z.string().optional(),
    })
    .optional(),
});

export const countriesSchema = z.array(countrySchema);

/** Lightweight select catalog entry (names + code + region only). */
export const countryCatalogItemSchema = z.object({
  name: z.string(),
  cca3: z.string(),
  region: z.string(),
});

export const countriesCatalogResponseSchema = z.object({
  data: z.array(countryCatalogItemSchema),
});

export type CountryV5 = z.infer<typeof countryV5Schema>;
export type Country = z.infer<typeof countrySchema>;
export type CountryCatalogItem = z.infer<typeof countryCatalogItemSchema>;
export type CountriesCatalogResponse = z.infer<
  typeof countriesCatalogResponseSchema
>;

export const mapCountryV5ToDomain = (country: CountryV5): Country => ({
  name: {
    common: country.names.common,
    official: country.names.official || country.names.common,
  },
  cca3: country.codes.alpha_3,
  population: country.population,
  region: country.region,
  capital: country.capitals.map((item) => item.name),
  flags: country.flag
    ? {
        png: country.flag.url_png,
        svg: country.flag.url_svg,
        alt: country.names.common,
      }
    : undefined,
});

export const mapCountryV5DetailResponse = (
  body: z.infer<typeof countryV5DetailResponseSchema>,
): Country => {
  if ('objects' in body.data) {
    const first = body.data.objects[0];
    if (!first) {
      throw new Error('Country not found');
    }
    return mapCountryV5ToDomain(first);
  }

  return mapCountryV5ToDomain(body.data);
};
