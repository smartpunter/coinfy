import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import styles from '/const/styles'

import { BTC } from '/const/cryptos'
import { state } from '/store/state'

import WalletListItem from '/components/partials/WalletListItem'

export default class WalletList extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'wallets')
        this.observer.observe(state.wallets[BTC.symbol])
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        const wallets = []

        Object.keys(state.wallets).forEach(symbol => {
            Object.keys(state.wallets[symbol]).forEach(address => {
                wallets.push({
                    symbol: symbol,
                    address: address,
                    wallet: state.wallets[symbol][address]
                })
            })
        })

        return React.createElement(WalletListTemplate, {
            wallets: wallets
        })
    }
}

function WalletListTemplate({ wallets }) {
    return (
        <div>
            {wallets.map(wallet => <WalletListItem wallet={wallet} />)}
        </div>
    )
}
