import { View, Text } from 'react-native'
import React from 'react'

export default function Tables() {
    return (
        <View>
            <List>
                <ListItem>
                    <Left>
                        <Text>Simon Mignolet</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem>
                    <Left>
                        <Text>Nathaniel Clyne</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem>
                    <Left>
                        <Text>Dejan Lovren</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
            </List>
        </View>
    )
}