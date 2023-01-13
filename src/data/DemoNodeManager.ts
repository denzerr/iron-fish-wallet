import { ConfigOptions, PeerResponse } from '@ironfish/sdk'
import NodeStatusResponse, { NodeStatusType } from 'Types/NodeStatusResponse'
import { BlockSyncerStatusType } from 'Types/BlockSyncerStatusType'

const BLOCK_SPEED = 60000

const STATUS: NodeStatusResponse = {
  node: {
    status: NodeStatusType.STARTED,
    nodeName: 'My Node Name Example',
  },
  blockchain: {
    synced: false,
    head: '0',
    totalSequences: '23344',
    headTimestamp: new Date().getTime(),
    newBlockSpeed: Math.random() * 1000,
  },
  blockSyncer: {
    status: 'syncing',
    syncing: {
      blockSpeed: BLOCK_SPEED,
      speed: BLOCK_SPEED / 50,
      progress: 0.01,
    },
  },
  peerNetwork: {
    peers: 23,
    isReady: true,
    inboundTraffic: Math.random() * 100,
    outboundTraffic: Math.random() * 100,
  },
}

const PEERS: PeerResponse[] = Array(23)
  .fill(null)
  .map(() => {
    const type = Math.random()
    return {
      state: 'active',
      identity: (Math.random() * 1000000).toFixed(3),
      version: 1024,
      head: 'ksajdlkasjdlsakjdaksdj',
      sequence: 2048,
      work: 'active',
      agent: 'test',
      name: 'Websocket',
      address: 'jalkaslkdjsaldjsalkdjlsakdjlksad',
      port: 8080,
      error: '',
      connections: 12,
      connectionWebSocket: type > 0.5 ? 'CONNECTED' : '',
      connectionWebSocketError: '',
      connectionWebRTC: type < 0.5 ? 'CONNECTED' : '',
      connectionWebRTCError: '',
      networkId: 13,
      genesisBlockHash: 'peer.genesisBlockHash',
    }
  })

let DEMO_NODE_CONFIG: Partial<ConfigOptions> = {
  nodeName: STATUS.node.nodeName,
  blockGraffiti: '',
  nodeWorkers: 6,
  minPeers: -1,
  maxPeers: 50,
  blocksPerMessage: 5,
}

let DEMO_NODE_CONFIG_TMP: Partial<ConfigOptions> = {}

class DemoNodeManager {
  status(): Promise<NodeStatusResponse> {
    return new Promise(resolve => {
      setTimeout(() => {
        const head = Number(STATUS.blockchain.head)
        const total = Number(STATUS.blockchain.totalSequences)
        if (head === total) {
          STATUS.blockSyncer.status = BlockSyncerStatusType.IDLE
        }
        if (STATUS.blockSyncer.status === BlockSyncerStatusType.SYNCING) {
          STATUS.blockchain.synced = false
          STATUS.blockSyncer.syncing.blockSpeed = Math.random() * 1000
          STATUS.blockSyncer.syncing.speed =
            total - head > STATUS.blockSyncer.syncing.speed
              ? STATUS.blockSyncer.syncing.speed
              : total - head
          STATUS.blockchain.head = (
            head +
            (total - head > STATUS.blockSyncer.syncing.speed
              ? STATUS.blockSyncer.syncing.speed
              : total - head)
          ).toString()
          STATUS.blockSyncer.syncing.progress = head / total
        } else {
          STATUS.blockchain.synced = true
          STATUS.blockSyncer.syncing.blockSpeed = BLOCK_SPEED
          STATUS.blockSyncer.syncing.progress = 100.0
        }
        resolve({
          ...STATUS,
          peerNetwork: {
            ...STATUS.peerNetwork,
            inboundTraffic: Math.abs(
              STATUS.peerNetwork.inboundTraffic + (0.5 - Math.random()) * 100000
            ),
            outboundTraffic: Math.abs(
              STATUS.peerNetwork.outboundTraffic +
                (0.5 - Math.random()) * 100000
            ),
          },
        })
      }, 500)
    })
  }

  peers(): Promise<PeerResponse[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(PEERS)
      }, 500)
    })
  }

  getConfig(): Partial<ConfigOptions> {
    return { ...DEMO_NODE_CONFIG, ...DEMO_NODE_CONFIG_TMP }
  }

  setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value
  }

  setValues(values: Partial<ConfigOptions>): void {
    for (const key in values) {
      if (key in DEMO_NODE_CONFIG) {
        this.setProperty(
          DEMO_NODE_CONFIG_TMP,
          key as keyof ConfigOptions,
          values[key as keyof ConfigOptions]
        )
      }
    }
  }

  async save(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (DEMO_NODE_CONFIG_TMP.nodeName) {
          STATUS.node.nodeName = DEMO_NODE_CONFIG_TMP.nodeName
        }
        DEMO_NODE_CONFIG = { ...DEMO_NODE_CONFIG, ...DEMO_NODE_CONFIG_TMP }
        DEMO_NODE_CONFIG_TMP = {}
        resolve()
      }, 500)
    })
  }
}

export default DemoNodeManager
