/*
 * Copyright 2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Gate {
    constructor(matrix) {
        this.matrix = matrix;
    }

}

Gate.X = new Gate(math.matrix([
    [0, 1],
    [1, 0]]));

Gate.Y = new Gate(math.matrix([
    [0, math.complex(0, -1)],
    [math.complex(0, 1), 0]]));

Gate.Z = new Gate(math.matrix([
    [1, 0],
    [0, -1]]));

Gate.H = new Gate(math.matrix([
    [1 / math.sqrt(2), 1 / math.sqrt(2)],
    [1 / math.sqrt(2), -1 / math.sqrt(2)]]));

Gate.S = new Gate(math.matrix([
    [1, 0],
    [0, math.complex(0, 1)]]));

Gate.St = new Gate(math.matrix([
    [1, 0],
    [0, math.complex(0, -1)]]));

Gate.T = new Gate(math.matrix([
    [1, 0],
    [0, math.complex(1 / math.sqrt(2), 1 / math.sqrt(2))]]));

Gate.Tt = new Gate(math.matrix([
    [1, 0],
    [0, math.complex(1 / math.sqrt(2), -1 / math.sqrt(2))]]));

Gate.RxPi8 = new Gate(math.matrix([
    [math.cos(math.pi / 16), math.multiply(math.complex(0, -1), math.sin(math.pi / 16))],
    [math.multiply(math.complex(0, -1), math.sin(math.pi / 16)), math.cos(math.pi / 16)]]));

Gate.RyPi8 = new Gate(math.matrix([
    [math.cos(math.pi / 16), -math.sin(math.pi / 16)],
    [math.sin(math.pi / 16), math.cos(math.pi / 16)]]));

Gate.RzPi8 = new Gate(math.matrix([
    [math.exp(math.multiply(math.complex(0, -1), math.pi / 16)), 0],
    [0, math.exp(math.multiply(math.complex(0, 1), math.pi / 16))]]));

Gate.RxmPi8 = new Gate(math.matrix([
    [math.cos(-math.pi / 16), math.multiply(math.complex(0, -1), math.sin(-math.pi / 16))],
    [math.multiply(math.complex(0, -1), math.sin(-math.pi / 16)), math.cos(-math.pi / 16)]]));

Gate.RymPi8 = new Gate(math.matrix([
    [math.cos(-math.pi / 16), -math.sin(-math.pi / 16)],
    [math.sin(-math.pi / 16), math.cos(-math.pi / 16)]]));

Gate.RzmPi8 = new Gate(math.matrix([
    [math.exp(math.multiply(math.complex(0, -1), -math.pi / 16)), 0],
    [0, math.exp(math.multiply(math.complex(0, 1), -math.pi / 16))]]));

// Pi / 12 gates
Gate.RxPi12 = new Gate(math.matrix([
    [math.cos(math.pi / 24), math.multiply(math.complex(0, -1), math.sin(math.pi / 24))],
    [math.multiply(math.complex(0, -1), math.sin(math.pi / 24)), math.cos(math.pi / 24)]]));

Gate.RyPi12 = new Gate(math.matrix([
    [math.cos(math.pi / 24), -math.sin(math.pi / 24)],
    [math.sin(math.pi / 24), math.cos(math.pi / 24)]]));

Gate.RzPi12 = new Gate(math.matrix([
    [math.exp(math.multiply(math.complex(0, -1), math.pi / 24)), 0],
    [0, math.exp(math.multiply(math.complex(0, 1), math.pi / 24))]]));

Gate.RxmPi12 = new Gate(math.matrix([
    [math.cos(-math.pi / 24), math.multiply(math.complex(0, -1), math.sin(-math.pi / 24))],
    [math.multiply(math.complex(0, -1), math.sin(-math.pi / 24)), math.cos(-math.pi / 24)]]));

Gate.RymPi12 = new Gate(math.matrix([
    [math.cos(-math.pi / 24), -math.sin(-math.pi / 24)],
    [math.sin(-math.pi / 24), math.cos(-math.pi / 24)]]));

Gate.RzmPi12 = new Gate(math.matrix([
    [math.exp(math.multiply(math.complex(0, -1), -math.pi / 24)), 0],
    [0, math.exp(math.multiply(math.complex(0, 1), -math.pi / 24))]]));

