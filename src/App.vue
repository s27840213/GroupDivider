<template lang="pug">
div(class="main-section")
  div(class="group-section")
    div(v-for="(group, index) in groups" :key="index" class="group")
      div(class="group__title") {{ `Group ${letter[index]} (${getGroupScore(group)})` }}
      div(class="group__players")
        div(v-for="player in group" :key="player.name")
          span {{ `${player.graduation_year} ${player.name}` }}
          span(:style="{ color: player.gender === 'M' ? 'blue' : 'red' }") {{ `(${player.gender})` }}
  div(class="group-section__ctrl")
    button(@click="divideArrayIntoSixGroups()") 隨機分組
    div
      span 標準差限制 {{ standardDeviationLimit }}
      input(
        v-model="standardDeviationLimit"
        type="range"
        min="0.2"
        max="0.6"
        step="0.01"
      )
div(class="player-section")
  div(class="player-section__player-num") 未分組人數: {{ playersData.length }}
  div(v-for="player in playersData" :key="player.name" class="player-section__player")
    span {{ `${player.graduation_year} ${player.name}` }}
    span(:style="{ color: player.gender === 'M' ? 'blue' : 'red' }") {{ player.gender }}
</template>

<script setup lang="ts">
import _playersData from '@/assets/players/playersData.json'
import { reactive, ref } from 'vue'

/** start of static data and interface */
interface IPlayer {
  timestamp: string
  name: string
  graduation_year: number
  donation: string
  comments: string
  gender: string
  jersey_size: string
  level: number
  group_id: string
}

const letter = ['A', 'B', 'C', 'D', 'E', 'F']

const skipCountMap = new Map([
  ['A', 0],
  ['B', 0],
  ['C', 0],
  ['D', 0],
  ['E', 0],
  ['F', 0]
])

let playersData: Array<IPlayer> = reactive(
  JSON.parse(JSON.stringify(_playersData))
)

const playerNum = playersData.length

let groups: Array<Array<IPlayer>> = reactive([])

const standardDeviationLimit = ref(0.25)
const isDeviding = ref(false)

/** end of static data and interface */

function initData() {
  groups.length = 0
  for (let i = 0; i < 6; i++) {
    groups.push([])
  }

  playersData = reactive(JSON.parse(JSON.stringify(_playersData)))
}

function sortPlayerData() {
  // First Shuffle the array to randomize its order, this is particularly for people in same level
  playersData.sort(() => Math.random() - 0.5)

  // comment this line if you want to sort truely randomly
  // playersData.sort((a, b) => b.level - a.level)

  // Second, sort the array by gender
  playersData.sort((a, b) => {
    return a.gender === b.gender ? 0 : a.gender === 'M' ? -1 : 1
  })
}

function divideArrayIntoSixGroups() {
  if (isDeviding.value) return
  isDeviding.value = true
  initData()
  sortPlayerData()
  const startGroup = Math.floor(Math.random() * 6)

  for (let i = 0; i < playerNum; i++) {
    // randomly start from one of the six groups, or we may be found that we did some tricks, haha
    const targetGroupIndex = (startGroup + i) % groups.length

    // if the group has too many members in current stage(means this group has some member has same group_id)
    // So we need to skip for a round, otherwise we will have some group has two mush members
    if (skipCountMap.get(letter[targetGroupIndex]) !== 0) {
      skipCountMap.set(
        letter[targetGroupIndex],
        (skipCountMap.get(letter[targetGroupIndex]) as number) - 1
      )
      continue
    }

    // push the currPlayer to the target group
    const currPlayer = playersData.shift() as IPlayer
    groups[targetGroupIndex].push(currPlayer)

    // if the currPlayer has group_id, we need to find the player who has same group_id and push it to the same group
    const hasGroupedPlayer = currPlayer.group_id !== ''
    if (hasGroupedPlayer) {
      const groupedPlayerIndex = playersData.findIndex((player) => {
        return player.group_id === currPlayer.group_id
      })
      const groupedPlayer = JSON.parse(
        JSON.stringify(playersData[groupedPlayerIndex])
      )
      playersData.splice(groupedPlayerIndex, 1)
      groups[targetGroupIndex].push(groupedPlayer)

      // we need to skip for a round, otherwise we will have some group has too mush members
      // thus, we used a map to record how many times we need to skip
      skipCountMap.set(
        letter[targetGroupIndex],
        (skipCountMap.get(letter[targetGroupIndex]) as number) + 1
      )
    }
  }
  isDeviding.value = false

  checkResult()
}

function checkResult() {
  // rule 1: every team should at least have two female players
  const hasInvalidGroup = groups.some((group) => {
    const femaleCount = group.filter((player) => player.gender === 'F').length
    return femaleCount < 2
  })

  /**
   * rule 2: the average score of each group should be close to each other
   */
  const scoreOfEachGroup = groups.map(
    (group) => group.reduce((acc, curr) => acc + curr.level, 0) / group.length
  )

  const averageScore =
    scoreOfEachGroup.reduce((acc, curr) => acc + curr, 0) / groups.length

  // range between 0.2 ~ 0.6
  const standardDeviation = Math.sqrt(
    scoreOfEachGroup.reduce((acc, curr) => {
      return acc + Math.pow(curr - averageScore, 2)
    }, 0) / scoreOfEachGroup.length
  )

  if (hasInvalidGroup || standardDeviation > standardDeviationLimit.value) {
    divideArrayIntoSixGroups()
  }
}

function getGroupScore(group: Array<IPlayer>) {
  const score = parseFloat(
    (group.reduce((acc, curr) => acc + curr.level, 0) / group.length).toFixed(2)
  )

  return isNaN(score) ? 0 : score
}

initData()
sortPlayerData()
</script>
<style scoped lang="scss">
.main-section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: gray;
}
.group-section {
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: auto;
  @media screen and (max-width: 1400px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(2, auto);
  }

  @media screen and (max-width: 688px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(3, auto);
  }

  @media screen and (max-width: 480px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: repeat(6, auto);
  }
  gap: 24px;
  padding: 24px 48px;
  box-sizing: border-box;
  flex-wrap: wrap;
  &__ctrl {
    @media screen and (max-width: 688px) {
      position: fixed;
      bottom: 0px;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > button {
      border: 1px solid #dadada;
      padding: 12px 24px;
      font-size: 24px;
      border-radius: 8px;
      margin-bottom: 12px;
      &:hover {
        cursor: pointer;
      }
    }

    > input {
    }
  }
}

.group {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 4px 0 #00000033;
  border-radius: 8px;
  background-color: #fff;
  min-height: 40vh;
  padding: 12px 24px;

  &__title {
    font-size: 20px;
    font-weight: bold;
  }

  &__players {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    gap: 24px;

    @media screen and (max-width: 960px) {
      gap: 12px;
    }
  }
}
.player-section {
  height: 100%;
  width: 220px;
  padding: 8px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  &__player-num {
    height: 40px;
    width: 100%;
    margin-bottom: 12px;
  }
  &__player {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 0;
    padding: 12px 24px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
    width: 100%;

    > span:nth-child(2) {
      margin-left: 4px;
    }
  }

  @media (max-width: 1200px) {
    display: none;
    background-color: red;
  }
}
</style>
