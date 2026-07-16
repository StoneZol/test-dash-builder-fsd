import { z } from 'zod';

/** Raw REST Countries v5 object (subset we request via response_fields). */
export const countryV5Schema = z.object({
  names: z.object({
    common: z.string(),
    official: z.string(),
  }),
  codes: z.object({
    alpha_3: z.string(),
  }),
  population: z.number(),
  region: z.string(),
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

export type CountryV5 = z.infer<typeof countryV5Schema>;
export type Country = z.infer<typeof countrySchema>;

export const mapCountryV5ToDomain = (country: CountryV5): Country => ({
  name: {
    common: country.names.common,
    official: country.names.official,
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
