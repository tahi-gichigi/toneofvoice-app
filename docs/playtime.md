# Playtime

60-second explorations between building sessions. No agenda.

---

## 2026-02-23 - Phonesthemes + Punctuation as Tone

### Phonesthemes
The `gl-` cluster in English covers both light *and* its absence: glitter, gleam, glimmer, glow - but also gloom, gloaming. It means "pertaining to light" including darkness. Plato noticed the same pattern in Greek in the 4th century BC.

The `sl-` cluster starts as "frictionless motion" (slide, slick, sled) and expands into almost everything pejorative: slack, slime, slob, slouch, slovenly, sly. The sound itself carries moral weight. Nobody designed this.

Other good ones:
- `sn-` = nose/mouth (snack, sneer, sneeze, sniff, snort, snout)
- `sw-` = pendulum motion (sway, sweep, swing, swirl, swoop)
- `tw-` = twisting (twist, twirl, tweak, twinge)
- `-ump` = hemispherical shape (bump, lump, hump, rump, stump)

### Punctuation as Tone
Confirmed by actual linguistics research (Gretchen McCulloch): a period after "ok, sounds good" introduces seriousness that makes positive words land cold. "OK." = "I don't want to talk to you anymore."

**The gap this reveals:** Brand tone guidelines almost never cover punctuation. A brand that says "we're warm and approachable" can still read as cold from period placement alone. Worth building into the style guide output someday.

---

## 2026-02-23 - Plato's Cratylus (primary source)

Read the actual dialogue, not the summary. Socrates argues specific letters carry inherent meaning - from the mouth up, watching how the tongue physically moves:

- **Rho (R)** = motion. The tongue is "most agitated and least at rest" pronouncing it. Evidence: trembling, rugged, crush, whirl.
- **Lambda (L)** = smoothness. Evidence: slip, sleek, sleep.

Then he immediately finds his own counterexample. The Greek word for "hardness" is *skleron* - which contains both rho (hardness) and lambda (smoothness). The letters contradict each other inside the same word. His response: convention must fill in where imitation fails. Half-concession, honest move.

That's basically where the field still is 2,400 years later. Phonesthemes are real and statistically significant, but any individual word can betray the pattern.

What was actually interesting: he's doing phenomenology, not analysis. Watching sensation in the mouth and inferring meaning from it. Nobody does that anymore.

---

## 2026-02-24 — The pixel that isn't a pixel

We just shipped Meta Pixel tracking. The name is a fossil. It used to be a literal 1×1 transparent GIF - loading it would ping Facebook's server with your IP, referrer, and timestamp. That was the whole trick. No JS required.

Now "the pixel" is a 400KB JavaScript SDK that fingerprints your browser, hooks into SPA routing, reads localStorage, and sends structured event payloads. The image still exists (the `<noscript>` fallback) but it's ceremonial now.

What I find interesting: the name stuck precisely *because* it undersells what it does. "We put a tiny pixel on your page" sounds harmless. "We injected Facebook's JS runtime into your app" sounds like what it actually is.

Language doing the work of making something sound smaller than it is - which is, ironically, exactly what tone of voice is for.

