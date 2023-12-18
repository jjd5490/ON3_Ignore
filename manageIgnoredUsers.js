function filterList() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("filterList");
  filter = input.value.toUpperCase();
  ul = document.getElementById("ignoredUL");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    txtValue = li[i].textContent;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function RenderIgnoredList() {
  const getIgnoredList = async () => {
    const response = await chrome.storage.local.get("Ignored");
    try {
      return Object.values(response.Ignored);
    } catch {
      return [];
    }
  };

  const removeUserFromIgnore = async (username, element) => {
    try {
      element.style.display = "none";
      const resp = await chrome.storage.local.get("Ignored");
      var ignoredList = resp.Ignored;
      const filteredList = ignoredList.filter((user) => {
        return user !== username;
      });
      chrome.storage.local.set({ Ignored: filteredList });
    } catch {
      return;
    }
  };

  const displayUsers = async () => {
    var ignoredList = await getIgnoredList();
    const ul = document.createElement("ul");
    ul.id = "ignoredUL";
    ul.classList.add("list-group");
    ignoredList.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "mb-3",
        "my-box-shadow",
        "li-rounded-corners",
        "shadow"
      );
      li.textContent = item;
      const btn = document.createElement("button");
      const icon = document.createElement("i");
      icon.classList.add("fa-solid", "fa-trash-can");
      btn.classList.add("btn", "btn-danger", "float-end");
      btn.onclick = function () {
        removeUserFromIgnore(item, li);
      };
      btn.appendChild(icon);
      li.appendChild(btn);
      ul.appendChild(li);
    });
    document.body.appendChild(ul);
    const searchBar = document.getElementById("filterList");
    searchBar.onkeyup = filterList;
  };
  displayUsers();
}

RenderIgnoredList();
