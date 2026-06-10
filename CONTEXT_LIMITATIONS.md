# The "Lost in the Middle" Phenomenon

Large language models often struggle as context length increases, a phenomenon research calls being "lost in the middle." While models are advertised with massive context windows, their effective performance is highest at the beginning (system instructions, core rules) and the end (the current prompt).

Information placed in the middle of a large context is often ignored or given lower priority. As you approach 50–60% of a model's capacity, recall and accuracy for middle-placed details tend to degrade.

### What this means for your workspace:

- **Prioritize the start and end:** Keep your core instructions (like AGENTS.md and SOUL.md) at the beginning. Keep the active task and critical data at the end.
- **Avoid middle clutter:** If your configuration or rule files become massive, the model may struggle to parse what actually matters.
- **Stay concise:** Short, clear rules are more effective than sprawling documents that risk burying key directives in the "middle zone."
