const path = require("path");

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const storyblokEntry = path.resolve("src/templates/storyblok-entry.js");

    graphql(
      `
        {
          allStoryblokEntry(filter: { slug: { eq: "settings" } }) {
            edges {
              node {
                id
                name
                created_at
                published_at
                uuid
                slug
                full_slug
                content
                is_startpage
                parent_id
                group_id
              }
            }
          }
        }
      `
    ).then(result => {
      if (result.errors) {
        console.log(result.errors);
        reject(result.errors);
      }

      const globalSettings = result.data.allStoryblokEntry.edges[0].node;
      resolve(
        graphql(
          `
            {
              allStoryblokEntry(filter: { slug: { ne: "settings" } }) {
                edges {
                  node {
                    id
                    name
                    created_at
                    published_at
                    uuid
                    slug
                    full_slug
                    content
                    is_startpage
                    parent_id
                    group_id
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors);
            return reject(result.errors);
          }

          const entries = result.data.allStoryblokEntry.edges || [];
          entries.forEach((entry, index) => {
            if (!entry) {
              return;
            }

            createPage({
              path: `/${entry.node.full_slug}/`,
              component: storyblokEntry,
              context: {
                globalSettings: globalSettings,
                story: entry.node
              }
            });
          });
        })
      );
    });
  });
};
