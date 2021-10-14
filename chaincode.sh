NAME=carChaincode
VERSION=$1
LANGUAGE=node
CHANNEL=mychannel
DOMAIN=example.com
DIR=$NAME-$VERSION

ORG1_PEERS=("peer0.org1.$DOMAIN")
ORDERER=orderer.$DOMAIN:7050

function checkResponse() {
    if [[ "$1" -ne 0 ]]; then
        echo $2
        exit $1
    fi
}

function copyFiles() {
    PEER=$1
    echo "############### Copying chaincode files on PEER: $PEER ###############"

    docker exec $PEER mkdir /$DIR
    docker cp carsChaincode/. $PEER:/$DIR
}

function install() {
    PEER=$1
    ORG_NUM=$2

    echo "############### Installing chaincode on $PEER ###############"

    docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org$ORG_NUM.$DOMAIN/msp" \
        $PEER peer chaincode install -n $NAME -v $VERSION -l $LANGUAGE -p /$DIR
}

function instantiate() {
    PEER=$1
    ORG_NUM=$2

    echo "############### Instantiating chaincode on $PEER ###############"

    docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org$ORG_NUM.$DOMAIN/msp" \
        $PEER peer chaincode instantiate -o $ORDERER -C $CHANNEL -n $NAME -l $LANGUAGE \
        -v $VERSION -c '{"args":["init"]}'
}

function upgrade() {
    PEER=$1
    ORG_NUM=$2

    echo "############### Upgrading chaincode on $PEER ###############"

    docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org$ORG_NUM.$DOMAIN/msp" \
        $PEER peer chaincode upgrade -o $ORDERER -C $CHANNEL -n $NAME -l $LANGUAGE \
        -v $VERSION -c '{"args":["init"]}'
}

for PEER in "${ORG1_PEERS[@]}"; do
    copyFiles $PEER 1
    checkResponse $? "Failed to copy chaincode files on PEER: $PEER"

    install $PEER 1
    checkResponse $? "Failed to install chaincode on PEER: $PEER"
done

# For another org, create another array above (i.e. ORG2_PEERS), and loop over them here

instantiate ${ORG1_PEERS[0]} 1
checkResponse $? "Failed to instantiate chaincode on PEER: ${ORG1_PEERS[0]}"

# upgrade ${ORG1_PEERS[0]} 1
# checkResponse $? "Failed to upgrade chaincode on PEER: ${ORG1_PEERS[0]}"
