export const OpenSourceContributions = [
    {
        id:'1',
        org:'GA4GH',
        repo:'elixir-cloud-aai/cloud-components',
        title:'fix: prevent re-fetch runs',
        status:'Merged',
        description:'This commit introduces optimizations to avoid re-fetching of runs on accordian click.Previously, the event handler handleExpandItem was triggered on each accordian click.With this change, a cache check has been implemented determining whether the run or an accordian within a run,being expanded already exists in the cache(done by checking the key of the run in the cache).If the run is not found in the cache, the handleExpandItem function is executed, thereby avoiding unnecessary network calls on subsequent accordian clicks.This optimization also handles clicking an accordian inside the runs accordian.',
        link:'https://github.com/elixir-cloud-aai/cloud-components/pull/257',
    },
    {
        id:'2',
        org:'GA4GH',
        repo:'elixir-cloud-aai/landing-page',
        title:'feat: add "No result found" to all searches',
        status:'Merged',
        description:'Added a "No [X=Funder,Partner,Solution]" text and a Reset button to Funders.jsx,Partners.jsx,Solutions.jsx.Used the already existing convention to check the length of filtered[X=Funders,Partners,Solutions] length to return the "No search found" (if length === 0) else return the list based on the matching search terms.',
        link:'https://github.com/elixir-cloud-aai/landing-page/pull/126',
        
    },
    {
        id:'3',
        org:'GA4GH',
        repo:'elixir-cloud-aai/krini',
        title:'feat(footer): support link',
        status:'Merged',
        description:'Through this commit I added a "Support" link in the footthat redirects the user to the Github Issue tracker page.Used the react-router-dom based Link component as used in the exisiticode.Added target="_blank" attribute to open link in a new tab.The new div for "Support" contains the same tailwind classname as used the already exisitng "About","Privacy" links.',
        link:'https://github.com/elixir-cloud-aai/krini/pull/31'
    },
    {
        id:'4',
        org:'GA4GH',
        repo:'elixir-cloud-aai/cloud-components',
        title:'refactor: replace <img> tags',
        status:'Open',
        description:'Through this commit I try to change the custom img tags wiImage component from next/image to optimize images.Previously height="auto" and width="auto" were the attributes being uswith the img tag which are now replaced with width={ } and height={pixel values as per the Next.js Image component conventions.Used tailwind media queries(responsive modifiers) to fit the images indifferent viewport sizes(specially smaller ones).Also added the corresponding domains in the next.config.js file for timages being fetched from external urls.',
        link:'https://github.com/elixir-cloud-aai/landing-page/pull/119',
    },
    {
        id:'4',
        org:'GA4GH',
        repo:'elixir-cloud-aai/cloud-components',
        title:'refactor(tes): remove filter by status dead code',
        status:'Open',
        description:'This commit refactors the ecc-client-lit-ga4gh-tes-runs/Removed the dead client-side code logic for filter by status./Removed the handleStateInput() function responsible for displaying tas/based on their status./Additionally, updated the tesRuns template removing the select by r/status drop-down option.',
        link:'https://github.com/elixir-cloud-aai/cloud-components/pull/272',
    },
]