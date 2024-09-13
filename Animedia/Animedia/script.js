const accessKey = "71yrOVTCno5YUxzyAN97coTBs4jQFsFAxTlXTRm4-8s";
const accessKey2 = "0isZDq9/Rc3w3XptEHUXdQ==nesqrkPziu8jhooX";
const searchForm = document.getElementById("search-container");
const searchBox = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResult = document.getElementById("search-results");
const searchResultDesc = document.getElementById("search-results-desc");
const apiKey = 'AIzaSyDzC3cNm030xbxjZYvLVv7eC6bPNY3o0jw';
const videoContainer = document.getElementById('video-container');
//const animalName = document.getElementById("animal-name");
//const animalLoc = document.getElementById("animal-loc");
//const animalDescription = document.getElementById("animal-desc");

const showMoreBtn = document.getElementById("show-more-btn");
const filterOption = document.getElementById("filter-options");

let keyword = "";
let page = 1;
let filter = "";
const options = {
    method: "GET",
    headers: {
        "X-Api-Key": accessKey2,
    },
};


async function fetchAnimalData() {
    keyword = searchBox.value;
    filter = filterOption.value;
    // Clear previous search results
    searchResult.innerHTML = "";

    const apiNinjasApiUrl = `https://api.api-ninjas.com/v1/animals?name=${keyword}`;
    const apiUrl = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&filter=${filter}&client_id=${accessKey}&per_page=12`;

    try {
        // Fetch animal description
        const respond = await fetch(apiNinjasApiUrl, options);
        if (!respond.ok) {
            throw new Error(`API request failed with status: ${respond.status}`);
        }
        const dataDesc = await respond.json();

        if (dataDesc.length === 0) {
            // Animal not found
            searchResultDesc.textContent = "Animal not found.";
            searchResultDesc.style.display = "block";
            return;
        }

        // Update the DOM elements with the description data
        document.getElementById('animal-name').textContent = keyword.toUpperCase();
        document.getElementById('animal-loc').textContent = dataDesc[0].locations;

        // Format taxonomy data
        const taxonomyData = dataDesc[0].taxonomy;
        const formattedTaxonomy = [];

        for (const key in taxonomyData) {
            if (taxonomyData.hasOwnProperty(key)) {
                const formattedEntry = `${capitalizeWords(key)}: ${taxonomyData[key]}`;
                formattedTaxonomy.push(formattedEntry);
            }
        }

        // Display the formatted taxonomy
        const taxonomyElement = document.getElementById('animal-desc');
        formattedTaxonomy.forEach(formattedEntry => {
            const pElement = document.createElement('p');
            pElement.textContent = formattedEntry;
            taxonomyElement.appendChild(pElement);
        });

        // Display the description
        searchResultDesc.style.display = "block";

        // Fetch images
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        const results = data.results;

        results.forEach((result) => {
            const image = document.createElement("img");
            image.src = result.urls.small;
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";

            imageLink.appendChild(image);
            searchResult.appendChild(imageLink);
        });

        showMoreBtn.style.display = "block";
    } catch (error) {
        console.error("API request error:", error);
    }
}

// The capitalizeWords function as previously defined
function capitalizeWords(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
}



searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    fetchAnimalData();
});

showMoreBtn.addEventListener("click", () => {
    page++;
    eraseData();
    fetchAnimalData();
});


    searchButton.addEventListener('click', function () {
        const query = searchBox.value;
        searchYouTubeVideo(query + "wildlife");
        eraseData();
    });

    function searchYouTubeVideo(query) {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.items.length > 0 && searchBox.value != "") {
                    const videoId = data.items[0].id.videoId;
                    displayVideo(videoId);
                } else {
                    videoContainer.innerHTML = "No video found.";
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayVideo(videoId) {
        videoContainer.innerHTML = `<iframe width="500" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }

    function eraseData() {
        var paragraph = document.getElementById("animal-desc");
        paragraph.textContent = "";

    }