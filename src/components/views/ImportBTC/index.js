import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { generateQRCode } from '/api/qr'
import { isAddress } from '/api/Coins/BTC'
import routes from '/const/routes'
import state from '/store/state'

import styles from '/const/styles'

import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import Div from '/components/styled/Div'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Select from '/components/styled/Select'
import { Label, SubLabel } from '/components/styled/Label'
import CenterElement from '/components/styled/CenterElement'
import IconHeader from '/components/styled/IconHeader'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'
import ImportAddress from '/components/views/ImportBTC/ImportAddress'
// import ImportPublic from '/components/views/ImportBTC/ImportPublic'
import ImportWIF from '/components/views/ImportBTC/ImportWIF'
import ImportBIP from '/components/views/ImportBTC/ImportBIP'

const types_import = {
    address: 0,
    // public_key: 1,
    private_key: 2,
    private_key_bip: 3
}

export default class ImportBitcoin extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            type_import: types_import.address,
            address: ''
        }

        // binding
        this.onChangeTypeImport = this.onChangeTypeImport.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    // Actions
    onChangeTypeImport(e) {
        const collector = collect()
        state.view.address = ''
        state.view.type_import = Number(e.target.value)
        collector.emit()
    }

    render() {
        const isValidAddress = isAddress(state.view.address)
        return React.createElement(ImportTemplate, {
            type_import: state.view.type_import,
            address: state.view.address,
            isValidAddress: isValidAddress,
            qrcodebase64: isValidAddress
                ? generateQRCode(state.view.address)
                : '',
            onChangeTypeImport: this.onChangeTypeImport
        })
    }
}

function ImportTemplate({
    type_import,
    address,
    isValidAddress,
    qrcodebase64,
    onChangeTypeImport
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img src="/static/image/coins/BTC.svg" />
                </IconHeader>
                <Div float="left">
                    <H1>Bitcoin</H1>
                    <H2>Import wallet</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <FormField>
                    <Div>
                        <QRCode>
                            <Show if={isValidAddress}>
                                <img width="150" src={qrcodebase64} />
                            </Show>
                        </QRCode>
                    </Div>
                    <Div>
                        <CenterElement>
                            <Address>{address}</Address>
                        </CenterElement>
                    </Div>
                </FormField>

                <form>
                    <FormField>
                        <FormFieldLeft>
                            <Label>I have my</Label>
                            <SubLabel>
                                Select the option you prefer to import.
                            </SubLabel>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Select width="100%" onChange={onChangeTypeImport}>
                                <option
                                    value={types_import.address}
                                    selected={
                                        type_import === types_import.address
                                    }
                                >
                                    Address
                                </option>
                                {/* <option
                                    value={types_import.public_key}
                                    selected={
                                        type_import === types_import.public_key
                                    }
                                >
                                    Public key
                                </option> */}
                                <option
                                    value={types_import.private_key}
                                    selected={
                                        type_import === types_import.private_key
                                    }
                                >
                                    Private key unencrypted (WIF)
                                </option>
                                <option
                                    value={types_import.private_key_bip}
                                    selected={
                                        type_import ===
                                        types_import.private_key_bip
                                    }
                                >
                                    Private key encrypted (BIP38)
                                </option>
                            </Select>
                        </FormFieldRight>
                    </FormField>

                    <Router>
                        <Route if={type_import === types_import.address}>
                            <ImportAddress />
                        </Route>
                        {/* <Route if={type_import===types_import.public_key}>
                            <ImportPublic />
                        </Route> */}
                        <Route if={type_import === types_import.private_key}>
                            <ImportWIF />
                        </Route>
                        <Route
                            if={type_import === types_import.private_key_bip}
                        >
                            <ImportBIP />
                        </Route>
                    </Router>

                    <Div clear="both" />
                </form>
            </RightContent>
        </RightContainerPadding>
    )
}
