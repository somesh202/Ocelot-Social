<template>
  <div class="donation-info">
    <progress-bar :title="title" :label="label" :goal="goal" :progress="progress" />
    <base-button filled @click="redirectToPage(links.DONATE)">
      {{ $t('donations.donate-now') }}
    </base-button>
  </div>
</template>

<script>
import links from '~/constants/links.js'
import { DonationsQuery } from '~/graphql/Donations'
import ProgressBar from '~/components/ProgressBar/ProgressBar.vue'

export default {
  components: {
    ProgressBar,
  },
  data() {
    return {
      links,
      goal: 15000,
      progress: 0,
    }
  },
  computed: {
    title() {
      const today = new Date()
      const month = today.toLocaleString(this.$i18n.locale(), { month: 'long' })
      return `${this.$t('donations.donations-for')} ${month}`
    },
    label() {
      return this.$t('donations.amount-of-total', {
        amount: this.progress.toLocaleString(this.$i18n.locale()),
        total: this.goal.toLocaleString(this.$i18n.locale()),
      })
    },
  },
  methods: {
    redirectToPage(pageParams) {
      pageParams.redirectToPage(this)
    },
  },
  apollo: {
    Donations: {
      query() {
        return DonationsQuery()
      },
      update({ Donations }) {
        if (!Donations[0]) return
        const { goal, progress } = Donations[0]
        this.goal = goal
        this.progress = progress
      },
    },
  },
}
</script>

<style lang="scss">
.donation-info {
  display: flex;
  align-items: flex-end;
  height: 100%;

  @media (max-width: 546px) {
    width: 100%;
    height: 50%;
    justify-content: flex-end;
    margin-bottom: $space-x-small;
  }
}
</style>
