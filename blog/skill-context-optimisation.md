# Skill Context Optimisation

I used to think the more context I fed my agents, the smarter they’d get. It felt logical—like giving someone a bigger library, surely they'll make better decisions. But I hit a wall where the tools started tripping over themselves, getting lost in their own documentation.

It turns out, there's a tipping point.

## The Small Problem
It started simple. I’d define a task, give it a few bullet points of instructions, and the agent would run. It was fast, efficient, and rarely hallucinated. I felt clever. I started adding more. A little background on the project here, some "best practices" there, maybe a few pages of API docs just in case.

[IMAGE PLACEHOLDER: A simple flow chart showing "Prompt -> Agent -> Task Complete"]

## The Bloat
Eventually, my "simple" instructions grew into a novella. I was treating the agent like a new hire who needed to memorize the entire company handbook before making their first coffee. The result? The agent became indecisive. It would spend half its compute budget parsing rules that didn't apply to the task at hand. It lost the forest for the trees.

[IMAGE PLACEHOLDER: A cluttered diagram showing an agent overwhelmed by too many input files and rules]

## The Shift
I realized I wasn't building a tool; I was building a bottleneck. I needed to rethink how I was structuring my agent's environment. The solution wasn't adding more context—it was curating it.

I shifted to a modular approach. Instead of dumping everything into one massive prompt, I started using a skill-based architecture. Think of it like a toolbox. You don't carry the whole garage with you; you carry the wrench, the screwdriver, and the hammer you actually need for the job.

[IMAGE PLACEHOLDER: A clean, modular "toolbox" diagram representing isolated skills]

## The Result
By isolating logic into specific, lean skills, the agents don't have to guess which rule applies. The context is immediate, relevant, and noise-free. My latency dropped, and the quality of output actually improved.

The lesson? Trust your system to handle the basics. Don't drown it in your own anxiety about what it "might" need. Give it exactly what it needs, and it’ll handle the rest.

Ready to see how I organized this? Next time, we'll dive into the directory structure of these skill sets.
