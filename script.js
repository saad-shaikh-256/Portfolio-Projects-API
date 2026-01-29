document.addEventListener("DOMContentLoaded", () => {
  const apiURL =
    "https://raw.githubusercontent.com/saad-shaikh-256/Portfolio-Projects-API/refs/heads/main/projects.json";
  const projectsContainer = document.getElementById("projects-container");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let allProjects = [];

  // --- ICONS (as SVG strings) ---
  const iconPreview = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`;
  const iconSource = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>`;

  async function fetchProjects() {
    try {
      const response = await fetch(apiURL);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const projects = await response.json();

      // --- UPDATED LINE ---
      // Filter out empty objects from the API and then reverse the array.
      allProjects = projects.filter((p) => p.projectId).reverse();

      filterAndDisplayProjects("All");
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      projectsContainer.innerHTML = `<p class="error-message">Sorry, we couldn't load the projects. Please try again later.</p>`;
    }
  }

  function filterAndDisplayProjects(selectedCategory) {
    projectsContainer.innerHTML = "";

    const filteredProjects =
      selectedCategory === "All"
        ? allProjects
        : allProjects.filter((project) =>
            project.projectCategory?.includes(selectedCategory)
          );

    if (filteredProjects.length === 0 && selectedCategory !== "All") {
      projectsContainer.innerHTML = `<p class="loading-message">No projects found in the "${selectedCategory}" category.</p>`;
      return;
    }

    filteredProjects.forEach((project) => {
      const categoryTags = project.projectCategory
        .map((cat) => `<span class="category-tag">${cat}</span>`)
        .join("");

      const projectCard = document.createElement("div");
      projectCard.className = "project-card";

      projectCard.innerHTML = `
         <div class="project-image-wrapper">
             <img src="${project.projectImage}" alt="${project.projectTitle}" class="project-image">
         </div>
         <div class="project-content">
             <h2 class="project-title">${project.projectTitle}</h2>
             <div class="project-categories">
                 ${categoryTags}
             </div>
             <p class="project-description">${project.projectDescription}</p>
             <div class="project-links">
                 <a href="${project.projectPreview}" target="_blank" rel="noopener noreferrer" class="project-btn btn-preview">
                     ${iconPreview} Live Preview
                 </a>
                 <a href="${project.projectSource}" target="_blank" rel="noopener noreferrer" class="project-btn btn-source" title="View Source Code">
                     ${iconSource}
                 </a>
             </div>
         </div>
       `;
      projectsContainer.appendChild(projectCard);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterAndDisplayProjects(category);
    });
  });

  fetchProjects();
});
