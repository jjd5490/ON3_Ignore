function FilterPosts() {
  // chrome.storage.local.set({ Ignored: ["Cronk"] });
  const getIgnoredList = async () => {
    try {
      const response = await chrome.storage.local.get("Ignored");
      return Object.values(response.Ignored);
    } catch {
      return [];
    }
  };

  const addUserToIgnore = async (username, post) => {
    try {
      post.style.display = "none";
      const resp = await chrome.storage.local.get("Ignored");
      var ignoredList = resp.Ignored;
      if (ignoredList) {
        ignoredList.splice(0, 0, username);
      } else {
        ignoredList = [username];
      }
      chrome.storage.local.set({ Ignored: ignoredList });
      hidePosts();
    } catch {
      return;
    }
  };

  const hidePosts = async () => {
    try {
      const ignoredList = await getIgnoredList();
      const authorToIgnore = "xwzcd";
      var posts = document.getElementsByClassName("message--post");
      Array.prototype.forEach.call(posts, function (p, index) {
        const author = p.getAttribute("data-author");
        const actionBar = p.getElementsByClassName("actionBar-set")[0];
        const addButton = p.getElementsByClassName("btn-default").length === 0;
        if (addButton) {
          const ignoreBtn = document.createElement("button");
          ignoreBtn.classList.add("btn", "btn-default");
          ignoreBtn.textContent = "Ignore";
          ignoreBtn.onclick = function () {
            addUserToIgnore(author, p);
          };
          actionBar.insertBefore(ignoreBtn, actionBar.firstChild);
        }
        for (let i = 0; i < ignoredList.length; i++) {
          const iu = ignoredList[i];
          if (iu === author) {
            p.style.display = "none";
          }
        }
        const quotedAuthors = p.getElementsByClassName(
          "bbCodeBlock-sourceJump"
        );
        Array.prototype.forEach.call(quotedAuthors, function (title, index) {
          const auth = title.textContent;
          ignoredList.forEach(function (user, index) {
            if (auth.substring(0, auth.search(" said")) === user) {
              p.style.display = "none";
              return;
            }
          });
        });
      });
    } catch {
      return;
    }
  };
  hidePosts();
}

FilterPosts();
