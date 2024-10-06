<template>
  <div class="landing-page">
    <!-- search bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        placeholder="Search for photo"
      />

      <!-- search results text -->
      <div v-if="showSearchResults" class="search-results">
        <h2>Search results for "{{ searchQuery }}"</h2>
      </div>
    </div>

    <!-- photo grid -->
    <div class="container">
      <div v-if="loading" class="skeleton-grid">
        <!-- skeleton loading placeholders -->
        <div v-for="n in 9" :key="n" class="photo-skeleton">
          <div class="skeleton-image"></div>
          <div class="skeleton-details">
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      </div>

      <div class="photo-grid" v-else>
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="photo-card"
          @click="openModal(photo)"
        >
          <img :src="photo.urls.small" :alt="photo.alt_description" />
          <div class="photo-details">
            <p>{{ photo.user.name }}</p>
            <p>{{ photo.user.location ? photo.user.country : 'Unknown Location' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- image modal -->
    <ImageModal
      :imageSrc="selectedPhoto?.urls.small"
      :user="selectedPhoto?.user.name"
      :location="selectedPhoto?.user.location || 'Unknown Location'"
      :visible="isModalVisible"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { getPhotos, searchPhotos } from "@/api/pixora";
import ImageModal from "@/components/ImageModal.vue";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  components: {
    ImageModal,
  },
  data() {
    return {
      photos: [],
      searchQuery: "",
      selectedPhoto: null,
      isModalVisible: false,
      loading: true,
      showSearchResults: false,
    };
  },
  async created() {
    await this.fetchLatestPhotos();
  },
  methods: {
    async fetchLatestPhotos() {
      try {
        this.loading = true;
        await delay(2000);
        this.photos = await getPhotos();
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        this.loading = false;
        this.showSearchResults = false;
      }
    },

    async handleSearch() {
      if (!this.searchQuery.trim()) {
        await this.fetchLatestPhotos();
        return;
      }

      try {
        this.loading = true;
        await delay(4000);
        this.photos = await searchPhotos(this.searchQuery);
        this.showSearchResults = true;
      } catch (error) {
        console.error("Error searching photos:", error);
      } finally {
        this.loading = false;
      }
    },
    openModal(photo) {
      this.selectedPhoto = photo;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.selectedPhoto = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #e2e8f0;
  padding: 150px 10px 180px 10px;

  input {
    position: absolute;
    padding: 20px;
    width: 80%;
    border: 1px solid #ddd;
    border-radius: 12px;
    margin-right: 10px;
    font-size: 1em;
    outline: none;
  }

  input::placeholder {
    color: #575656;
  }
}

.search-results {
  text-align: center;
  margin-top: -80px;
  margin-bottom: 20px;
}

.search-results h2 {
  color: #575656;
  font-size: 3em;
  text-align: left;
  font-weight: 500;
}

.container {
  margin-top: -90px;
  padding: 0 40px 0 150px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 0 60px 0 60px;
}
.photo-card {
  position: relative;
  width: 100%;
  height: 100%;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 13%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    transition: opacity 0.3s ease;
    opacity: 0.8;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  .photo-details {
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: white;
    z-index: 2;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  }

  &:hover img {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
}

.photo-card:nth-child(3n + 2) {
  margin-top: 40px;
}

.photo-card img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 120px;
}

.photo-skeleton:nth-child(3n + 2) {
  margin-top: 40px;
}

.photo-skeleton {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;

  .skeleton-image {
    width: 100%;
    height: 400px;
    background-color: #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-details {
    .skeleton-text {
      height: 15px;
      background-color: #ddd;
      border-radius: 4px;
      margin-bottom: 8px;
      animation: shimmer 2s infinite;

      &.short {
        width: 60%;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

@media (max-width: 1200px) {
  .search-bar {
    padding: 100px 10px 120px 10px;

    input {
      width: 90%;
    }
  }

  .container {
    padding: 0 20px;
    margin-bottom: 20px;
  }

  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin: 0 30px;
  }
  .photo-card:nth-child(3n + 2) {
    margin-top: 0;
  }

  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin: 0 30px;
  }

  .photo-skeleton:nth-child(3n + 2) {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .search-bar {
    padding: 80px 10px 100px 10px;

    input {
      width: 95%;
    }
  }

  .search-results h2 {
    font-size: 2.5em;
  }

  .container {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .photo-grid {
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0 20px;
  }

  .photo-card:nth-child(3n + 2) {
    margin-top: 0;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0 30px;
  }

  .photo-skeleton:nth-child(3n + 2) {
    margin-top: 0;
  }
}

@media (max-width: 480px) {
  .search-bar {
    padding: 60px 10px 80px 10px;

    input {
      width: 90%;
      padding: 15px;
      font-size: 0.9em;
    }
  }

  .search-results h2 {
    font-size: 2em;
  }

  .container {
    margin-top: 10px;
    margin-bottom: 20px;
    padding: 0 10px;
  }

  .photo-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .photo-card:nth-child(3n + 2) {
    margin-top: 0;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0 30px;
  }

  .photo-skeleton:nth-child(3n + 2) {
    margin-top: 0;
  }
}
</style>
