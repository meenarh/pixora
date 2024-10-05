<!-- src/components/ImageModal.vue -->
<template>
  <transition name="fade">
    <div class="modal" v-if="visible" @click="closeModal">
      <transition name="zoom">
        <div class="modal-content" @click.stop>
          <span class="close" @click="closeModal">&times;</span>
          <img :src="imageSrc" alt="Modal Image" />
          <div class="photo-details">
            <p>{{ user }}</p>
            <p>{{ location }}</p>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
}

.modal-content {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  background-color: white;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(0.9);
  border-radius: 12px;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
}

.close:hover {
  color: #000;
}

.photo-details {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-left: 30px;
  padding-bottom: 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: white;
  text-align: left;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.photo-details p {
  margin: 20px 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
  transition: transform 0.5s ease;
}
.zoom-enter, .zoom-leave-to {
  transform: scale(0.9);
}
</style>