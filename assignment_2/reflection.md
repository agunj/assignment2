What went well? Where did the AI save you significant time or solve something you might have struggled with?
- Getting past the awkward stage of coding by generating the foundation of the chart in a few seconds while spending most of my time tailoring the bugs and adding more features was nice. Also, I was able to be more creative with the visualization, since I wouldn't know how to go about implementing the dynamic legend which updates order based on which countries are in the top 10 of the given year. 

What required manual fixes? List at least two things you had to correct yourself, and explain what was wrong.
- The things I had to fix myself were pretty minor, one things being the margins of the entire chart being wrong and the other being fixing some overlapping that was occuring with axis labels and axis tick labels. 

How did your prompts evolve? Paste your first prompt and your last prompt for the same feature, and describe what changed.
- First prompt: "I'm building a D3.js v7 visualization in a browser project.
I have a CSV file at data/gapminder_subset.csv with columns:
country, continent, year, life_expectancy, income_per_person, population. Set up an SVG canvas with margins, load the CSV, and draw a line plot for the top 10 countries in a certian value.Value can be selected from a dropdown, and chart will change dynamically. Line plot x axis is year, while y axis is chosen from drop down value. If a country falls from top 10, it disapears from the chart."
- Last prompt: "Axis labels for millions and thousandds should be shortened Xk or Xm, or Xb. slider should be longer. Add a paragraph of lorem ipsum under the title in index.html When dragging slider, remove transitions and opt for a seamless, instant update. add a dynamic title that is Top 10 nations in Y in YEAR"
- The main thing that changed is that, early on, I was speaking to it more like a person, and by the end I was simply stating in a list all the fixes I needed in simplest terms. Throughout prompting, I did have to retry certain prompts that were misinterpretted or missed, so by the end I was using terminology and grammar that Copilot was able to understand and apply well.

Your take: In one or two sentences, how do you see yourself using tools like this in future visualization work?
- I want to ensure that I can still code proficiently by hand, but using these tools can be beneficial to expand the scope of what I am able to accomplish, especially if I know to code part of something, and I use this tool to code the parts I don't entirely know how to code. 