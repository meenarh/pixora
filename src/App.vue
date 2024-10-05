<template>
  <div class="landing-page">
    <!-- search bar -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        placeholder="Search for photos"
      />
    </div>

    <!-- search results text -->
    <div v-if="showSearchResults" class="search-results">
      <h2>Search results for "{{ searchQuery }}"</h2>
    </div>

    <!-- photo grid -->
    <div class="photo-grid">
      <div v-if="loading" class="loading-placeholder-grid">
        <!-- skeleton loading placeholders -->
        <div v-for="n in 9" :key="n" class="photo-skeleton">
          <div class="skeleton-image"></div>
          <div class="skeleton-details">
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="photo-card"
          @click="openModal(photo)"
        >
          <img :src="photo.urls.regular" :alt="photo.description" />
          <div class="photo-details">
            <p>{{ photo.user.name }}</p>
            <p>{{ photo.user.location }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- image modal -->
    <ImageModal
      :imageSrc="selectedPhoto?.urls.full"
      :visible="isModalVisible"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { getPhotos, searchPhotos } from "@/api/pixora";
import ImageModal from "@/components/ImageModal.vue";

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
      showSearchResults: false,  // Tracks if a search was initiated
    };
  },
  async created() {
    await this.fetchLatestPhotos();
  },
  methods: {
    async fetchLatestPhotos() {
      try {
        this.loading = true;
        this.photos = await getLatestAfricanPhotos();
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        this.loading = false;
        this.showSearchResults = false; // Reset search result message when fetching latest photos
      }
    },
    async handleSearch() {
      if (!this.searchQuery.trim()) {
        await this.fetchLatestPhotos();
        return;
      }

      try {
        this.loading = true;
        this.photos = await searchPhotos(this.searchQuery);
        this.showSearchResults = true; // Set flag to show search result message
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
.landing-page {
  padding: 20px;

  .search-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    input {
      padding: 10px;
      width: 300px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-right: 10px;
      font-size: 1em;
    }
  }

  .search-results {
    text-align: center;
    margin-bottom: 20px;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 16px 0;
  }

  .photo-card img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .loading-placeholder-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
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

  .photo-card {
    position: relative;

    .photo-details {
      position: absolute;
      bottom: 10px;
      left: 10px;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }

    &:hover img {
      transform: scale(1.05);
      transition: transform 0.3s ease;
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
}
</style>