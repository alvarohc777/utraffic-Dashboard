<template>
  <q-card class=" row justify-between column">
    <div>

      <p class="text-h6 text-purple-10 text-center" style="margin-bottom: 0;"> Crédito</p>
      <p class="text-subtitle2  text-center"> {{ cliente.creditId }}</p>
    </div>

    <semi-circular :progress="progressCalculator(cliente.paymentFee)" title="Progreso"
      :score="scoreCalculator(cliente.paymentFee)" />


    <div>
      <q-card-section>
        <div class="flex flex-center column">
          <div class="row " style="width: 100%">
            <div class="fit row wrap justify-start items-start content-start">
              <div class="col">
                <p style="margin: 0px" class="text-purple-10">
                  <strong> Crédito: </strong>
                </p>
                <p class="text-subtitle2">{{ cliente.creditId }}</p>
              </div>
              <div class="col">
                <p style="margin: 0px" class="text-purple-10">
                  <strong> Fecha Solicitud: </strong>
                </p>
                <p class="text-subtitle2">{{ cliente.fechaSolicitud }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-center column">
          <div class="row" style="width: 100%">
            <div class="fit row wrap justify-start items-start content-start">
              <div class="col">
                <p style="margin: 0px" class="text-purple-10">
                  <strong> Monto: </strong>
                </p>
                <p class="text-subtitle2">{{ formattedTotal.format(cliente.monto) }}</p>
              </div>
              <div class="col">
                <p style="margin: 0px" class="text-purple-10">
                  <strong> Plazo: </strong>
                </p>
                <p class="text-subtitle2">{{ cliente.plazo }}</p>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </div>
  </q-card>
</template>

<style></style>

<script setup>
import { progressCalculator, scoreCalculator, formattedTotal } from 'src/scripts/utils';
import SemiCircular from "src/components/Charts/SemiCircular.vue";
import { toRefs } from 'vue';
const props = defineProps(["cliente"]);
let { cliente } = toRefs(props);
</script>
