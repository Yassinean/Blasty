package com.blasty.model;


import jakarta.persistence.*;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "clients")
@PrimaryKeyJoinColumn(name = "user_id")
public class Client extends User {}

