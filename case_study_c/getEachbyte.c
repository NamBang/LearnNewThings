
#include<stdio.h>
#include <stdint.h>
typedef union {
   char byte[4];
    int val_16;
} value;

void getEachbyte_v1_0(int *a){
    value valInt;
    valInt.val_16 = *a;
    printf("%02x --- %02x", valInt.byte[2], valInt.byte[1]);
}
void getEachbyte_v1_1(uint16_t *a){
    uint16_t a1 = *a;
    uint16_t a2 = *a;
    a1 = a1 >> 8;
    a2 = a2 & 0x00FF;
    a2 = a2 << 8;
    a1 = a1 | a2;
    printf("--- %04x",a1);
}
int main()
{
    int a = 0x00005678;
    uint16_t b = 0x3456;
    getEachbyte_v1_1(&b);
    return 0;
}