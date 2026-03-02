There is an issue with storing memory in the gemini and other bots, they use memory compaction to solve it on their side, but this causes the last few conversations to be lost

One solution I have been hearing about is a hierarchical approach

the idea is somewhat simple at first - a new query requires you to figure out what type of data is expected.
    do we expect something like a fact to come back
    do we expect something like an estimation
    how about math
    what about a synthesis of previous facts

to this end we want to create a system that will help us choose the correct method of recall and storage

we have access to a lot of different database types, for this project we want to have everything be local - even our embeddings which we can use a local ollama instance for

we should also have a cache of expected data that we can do hyper fast retrieval on

I want this process to run alongside an agent like gemini, it should be able to document and be called into like a tool, and it should be used to keep track of incoming data

look up the current things for open claw and how they are getting used, this is going to be a project for those.