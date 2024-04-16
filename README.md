connecting to instance
ssh -i C:\Users\Wiktor\.ssh\chmura ubuntu@44.205.252.236


installing depenencies
sudo apt update
sudo apt upgrade
sudo apt install docker-compose

git clone https://github.com/wiktorstankiewicz/chmura1.git
cd ./chmura1
sudo docker-compose up