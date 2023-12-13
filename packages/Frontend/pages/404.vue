<template>
  <div id="container">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 786.94 294.29" style="enable-background:new 0 0 786.94 294.29;" xml:space="preserve">
      <path class="line anim" d="M151.13,226.53H26.2v-56.4L151.13,21.64h59.77v151.69h30.98v53.2h-30.98v46.13h-59.77V226.53z M151.13,173.33V95.65l-66.01,77.67H151.13z" />
      <path class="line anim" d="M669.99,226.53H545.07v-56.4L669.99,21.64h59.77v151.69h30.98v53.2h-30.98v46.13h-59.77V226.53z M669.99,173.33V95.65l-66.01,77.67H669.99z" />
      <path class="line anim" d="M393.47,80.81c36.58,0,66.34,29.76,66.34,66.34c0,36.58-29.76,66.34-66.34,66.34s-66.34-29.76-66.34-66.34C327.13,110.57,356.89,80.81,393.47,80.81 M393.47,21.81c-69.22,0-125.34,56.11-125.34,125.34s56.11,125.34,125.34,125.34s125.34-56.11,125.34-125.34S462.69,21.81,393.47,21.81L393.47,21.81z" />
    </svg>
  </div>
</template>

<style>
  #container {
  background-color: #8600a9;
  width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.line {
  fill: none;
  stroke: white;
  stroke-width: 12;
  stroke-dasharray: 200 100;
}

.anim {
  -webkit-animation: swirls 2s linear infinite;
  -moz-animation: swirls 2s linear infinite;
  -o-animation: swirls 2s linear infinite;
  animation: swirls 2s linear infinite;
}

@keyframes swirls {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 300;
  }
}
</style>