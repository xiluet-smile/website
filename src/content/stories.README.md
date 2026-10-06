# Patient video stories ("In their own words")

Rendered on Home (after the before/after cases) and on each doctor's profile as soon as this list has
entries; with an empty list the section is hidden. One object per clip, in `stories.json` (English)
and `es/stories.json` (same `id`s, translated `quote`/`treatment`):

```json
{
  "id": "story-1",
  "video": "/videos/stories/story-1.mp4",      // vertical 9:16, H.264, ≤ 8 MB, silent is fine (sound plays on tap)
  "poster": "story-1-poster.jpg",              // 9:16 frame in src/assets (goes through the image pipeline)
  "quote": "I cried when I saw them. In a good way.",
  "name": "Maria R.",                          // as the patient agreed to be shown
  "treatment": "20 veneers",
  "duration": "0:42",
  "doctor": "Dr. Roger Ramos Navarro, DMD"     // optional: also shown on that doctor's page
}
```

Every entry needs the patient's written consent to publish the clip, quote and name.
