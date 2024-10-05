<!-- src/components/ImageModal.vue -->
<template>
   <transition name="fade">
     <div class="modal" v-if="visible" @click="closeModal">
       <transition name="zoom">
         <div class="modal-content" @click.stop>
           <span class="close" @click="closeModal">&times;</span>
           <img :src="imageSrc" alt="Modal Image" />
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
     visible: {
       type: Boolean,
       default: false,
     },
   },
   methods: {
     closeModal() {
       this.$emit('close');
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
 }
 
 .modal-content {
   position: relative;
   max-width: 90%;
   max-height: 90%;
   background-color: white;
   padding: 20px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   transform: scale(0.9);
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
 
 /* Animations */
 .fade-enter-active, .fade-leave-active {
   transition: opacity 0.5s ease;
 }
 .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
   opacity: 0;
 }
 
 .zoom-enter-active, .zoom-leave-active {
   transition: transform 0.5s ease;
 }
 .zoom-enter, .zoom-leave-to {
   transform: scale(0.9);
 }
 </style>